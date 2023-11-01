module.exports = {
	resolvers: {
		ConfigurableProduct: {
			special_price: {
				selectionSet: "{ name price_range { maximum_price { final_price { value } } } }",
				resolve: (root, args, context, info) => {
					let max = 0;

					try {
						max = root.price_range.maximum_price.final_price.value;
					} catch (e) {
						// ignore
					}

					return context.Discounts.Query.discounts(
						{ root, args, context, info, selectionSet: "{ name discount }" }
					)
						.then((response) => {
							const discountConfig = response.find((discount) => discount.name === root.name);

							if (discountConfig) {
								return max * ((100 - discountConfig.discount) / 100);
							} else {
								return max
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

