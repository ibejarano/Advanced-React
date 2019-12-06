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
};

module.exports = Mutations;
