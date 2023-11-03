module.exports = {
	resolvers: {
		ConfigurableProduct: {
			special_price: {
				selectionSet: /* GraphQL */ `{
					sku
					price_range { 
						minimum_price {
							regular_price_value { value }
						}
					}
					discount {
						percent_off
					  }
			    }`,
				resolve: (root, args, context, info) => {
					let regularPriceValue = 0;

					try {
						regularPriceValue = root.price_range.minimum_price.regular_price.value;
					} catch (e) {
						regularPriceValue = 0;
					}

					let additionalDiscountValue = 0;

					try {
						additionalDiscountValue = root.price_range.minimum_price.discount.percent_off;
					} catch (e) {
						additionalDiscountValue = 0;
					}

					return context.Discounts.Query.discounts(
						{ root, args, context, info, selectionSet: "{ sku discount }" }
					)
						.then((response) => {
							const discountObj = response.find((discount) => discount.sku === root.sku);

							if (discountObj) {
								return regularPriceValue * ((100 - additionalDiscountValue - discountObj.discount) / 100);
							} else {
								return regularPriceValue;
							}
						})
						.catch(() => {
							return null;
						});
				},
			},
		},
	},
};

