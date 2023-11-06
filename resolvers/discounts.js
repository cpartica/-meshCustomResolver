/*eslint no-unused-vars: "error"*/
const resolvers = {
    ConfigurableProduct: {
        discounted_price: {
            selectionSet: /* GraphQL */ `{
					sku
					price_range { 
						minimum_price { regular_price_value { value } }
					}
					discount { percent_off }
			    }`,
            resolve: (root, args, context, info) => {
                let commercePrice = 0;

                try {
                    commercePrice = root.price_range.minimum_price.regular_price.value;
                } catch (e) {
                    commercePrice = 0;
                }

                let commerceDiscount = 0;

                try {
                    commerceDiscount = root.price_range.minimum_price.discount.percent_off;
                } catch (e) {
                    commerceDiscount = 0;
                }

                return context.Discounts.Query.discounts(
                    {root, args, context, info, selectionSet: "{ sku discount }"}
                )
                    .then((response) => {
                        const erpDiscountObj = response.find((discount) => discount.sku === root.sku);

                        if (erpDiscountObj) {
                            return commercePrice * ((100 - (commerceDiscount + erpDiscountObj.discount)) / 100);
                        } else {
                            return commercePrice;
                        }
                    })
                    .catch(() => {
                        return commercePrice;
                    });
            },
        },
        discount_percentage: {
            selectionSet: /* GraphQL */ `{
					sku
					discount { percent_off }
			    }`,
            resolve: (root, args, context, info) => {
                let commerceDiscount = 0;

                try {
                    commerceDiscount = root.price_range.minimum_price.discount.percent_off;
                } catch (e) {
                    commerceDiscount = 0;
                }

                return context.Discounts.Query.discounts(
                    {root, args, context, info, selectionSet: "{ sku discount }"}
                )
                    .then((response) => {
                        const erpDiscountObj = response.find((discount) => discount.sku === root.sku);

                        if (erpDiscountObj) {
                            return commerceDiscount + erpDiscountObj.discount;
                        } else {
                            return commerceDiscount;
                        }
                    })
                    .catch(() => {
                        return commerceDiscount;
                    });
            },
        }
    },
};

module.exports = {
    resolvers
}