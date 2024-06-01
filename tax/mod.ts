/**
 * A collection of utility functions regarding to tax calculations
 * @module
 *
 * @example
 * ```ts
 * const taxCalculator = new TaxCalculator(0.1);
 * const priceWithTax = taxCalculator.includeTax({ price: 1000, taxIncluded: false });
 * // 1100
 * const priceWithoutTax = taxCalculator.excludeTax({ price: 1100, taxIncluded: true });
 * // 1000
 * ```
 */

export type PriceArgs = {
	price: number
	taxIncluded: boolean
}

/**
 * A class for calculating tax amounts and prices.
 */
export class TaxCalculator {
	private taxRate: number

	/**
	 * Creates an instance of TaxCalculator.
	 * @param {number} taxRate - The tax rate to be used for calculations.
	 * @example
	 * ```ts
	 * const taxCalculator = new TaxCalculator(0.1);
	 * ```
	 */
	constructor(taxRate: number) {
		this.taxRate = taxRate
	}

	/**
	 * Calculates the tax amount for a given price.
	 * @param {PriceArgs} args - The price and whether tax is included.
	 * @returns {number} - The calculated tax amount.
	 * @example
	 * ```ts
	 * const tax = taxCalculator.tax({ price: 1000, taxIncluded: false });
	 * // 100 if tax rate is 0.1
	 * ```
	 */
	public tax({ price, taxIncluded }: PriceArgs): number {
		const basePrice = taxIncluded
			? this.excludeTax({ price, taxIncluded })
			: price
		return Math.round(basePrice * this.taxRate)
	}

	/**
	 * Calculates the price including tax.
	 * @param {PriceArgs} args - The price and whether tax is included.
	 * @returns {number} - The price including tax.
	 * @example
	 * ```ts
	 * const priceWithTax = taxCalculator.includeTax({ price: 1000, taxIncluded: false });
	 * // 1100 if tax rate is 0.1
	 * ```
	 */
	public includeTax({ price, taxIncluded }: PriceArgs): number {
		if (taxIncluded) return price
		return price + this.tax({ price, taxIncluded: false })
	}

	/**
	 * Calculates the price excluding tax.
	 * @param {PriceArgs} args - The price and whether tax is included.
	 * @returns {number} - The price excluding tax.
	 * @example
	 * ```ts
	 * const priceWithoutTax = taxCalculator.excludeTax({ price: 1100, taxIncluded: true });
	 * // 1000 if tax rate is 0.1
	 * ```
	 */
	public excludeTax({ price, taxIncluded }: PriceArgs): number {
		if (!taxIncluded) return price
		return Math.round(price / (1 + this.taxRate))
	}

	/**
	 * Extracts the tax amount from a price that includes tax.
	 * @param {PriceArgs} args - The price and whether tax is included.
	 * @returns {number} - The extracted tax amount.
	 * @example
	 * ```ts
	 * const extractedTax = taxCalculator.extractTax({ price: 1100, taxIncluded: true });
	 * // 100 if tax rate is 0.1
	 * ```
	 */
	public extractTax({ price, taxIncluded }: PriceArgs): number {
		if (!taxIncluded) return 0
		return price - this.excludeTax({ price, taxIncluded: true })
	}
}
