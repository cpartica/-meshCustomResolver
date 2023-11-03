const resolvers = {
  ConfigurableProduct: {
    inventory_details: {
        selectionSet: /* GraphQL */ `
          {
            sku
          }
        `,
        resolve(root, _args, context, info) {
          return context.Inventory.Query.inventory({
            root,
            args: {
              skus: `${root.sku}`
            },
            context,
            info,
            selectionSet: "{ products { sku location quantity zipcode} }"
          }).then((response) => { 
              return response.products.filter((product) => product.sku === root.sku)[0];
          })
        }
      }
    }
  }
  
  module.exports = {
      resolvers
  }
  