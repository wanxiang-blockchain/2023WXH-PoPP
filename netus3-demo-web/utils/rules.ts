let amountRules = new RegExp('^([0-9]|[0-9]\\d|100)$')
export const validateAmount = (value: string) => amountRules.test(value)
