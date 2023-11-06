const resolvers = {
    ConfigurableProduct: {
		discounted_price: {
            selectionSet: /* GraphQL */ `
          {
            discounted_price
          }
        `,
            resolve(root, _args, context, info) {
                return context.Discounts.Query.discounts({
                    root,
                    args: {
                        skus: `${root.sku}`
                    },
                    context,
                    info,
                    selectionSet: "{ discounted_price }"
                }).then((response) => {
                    return response[0].discounted_price;
                })
            }
        },
        discount_percentage: {
            selectionSet: /* GraphQL */ `
          {
            discount_percentage
          }
        `,
            resolve(root, _args, context, info) {
                return context.Discounts.Query.discounts({
                    root,
                    args: {
                        skus: `${root.sku}`
                    },
                    context,
                    info,
                    selectionSet: "{ discount_percentage }"
                }).then((response) => {
                    return response[0].discount_percentage;
                })
            }
        }
    }
}

module.exports = {
    resolvers
}
