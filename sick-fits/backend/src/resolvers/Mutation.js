const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info
    );
    console.log(item);

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
    const item = await ctx.db.query.item({ where }, `{id title}`);
    // 2 check if they own that item or check permission
    // TODO
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
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // we set the uswt as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // a 1 year cookie
    });
    // finally return to the broser
    return user;
  },
};

module.exports = Mutations;
