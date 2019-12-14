const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { hasPermission } = require('../utils');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    // 1. take a copy of the updates
    const updates = { ...args };
    // 2. remove the id from updates
    delete updates.id;
    // 3 run the update method
    return ctx.db.mutation.updateItem({
      data: updates,
      where: {
        id: args.id,
      },
      info,
    });
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1 find theitem
    const item = await ctx.db.query.item({ where }, `{id title user { id }}`);
    // 2 check if they own that item or check permission
    // TODO
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(
      permission => ['ADMIN', 'ITEMDELETE'].includes(permission)
    )
    if(!ownsItem && !hasPermissions){
      throw new Error('You are not allowed to do that!')
    }
    // 3 delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // hash the password
    const password = await bcrypt.hash(args.password, 10);
    // create the usr in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // CREATE THE JWT FOR THEM
    const token = jwt.sign({ user: user.id }, process.env.APP_SECRET);
    // we set the uswt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // a 1 year cookie
    });
    // finally return to the broser
    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1 check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2 check if their pass is right
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    // 3 generate the jwt token
    const token = jwt.sign({ user: user.id }, process.env.APP_SECRET);
    // 4 setthe cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye' };
  },
  async requestReset(parent, args, ctx, info) {
    // 1 check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2 set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpirity = Date.now() + 3600000; // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpirity },
    });
    // 3 email them that reset token
    return { message: 'thanks' };
  },
  async resetPassword(parent, args, ctx, info) {
    // 1 check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error('Yours passwords dont match');
    }
    // 2 check if it is legit resettoken
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpirity_gte: Date.now() - 360000,
      },
    });
    // 3 check if its expired
    if (!user) {
      throw new Error('This token is either invalid or expired!');
    }
    // 4 hash that new password
    const password = await bcrypt.hash(args.password, 10);
    // 5 save the new password to the user and remove resettokens fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpirity: null,
      },
    });
    // 6 generate JWT
    const token = jwt.sign({ user: updatedUser.id }, process.env.APP_SECRET);
    // 7 set the jwt cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    // 8 return the new user
    return updatedUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // 1 check if logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in');
    }
    // 2 query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId,
        },
      },
      info
    );
    console.log('THIS IS THE USER!', currentUser);
    // 3 check if they have permission to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    // 4 update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },
};

module.exports = Mutations;
