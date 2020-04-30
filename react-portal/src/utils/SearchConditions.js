const conditions = [
  {
    value: 0,
    label: 'is',
    condition: '=',
    func: (e) => e,
  },
  {
    value: 1,
    label: 'is not',
    condition: '!=',
    func: (e) => e,
  },
  {
    value: 2,
    label: 'contains',
    condition: 'LIKE',
    func: (e) => `%${e}%`,
  },
  {
    value: 3,
    label: 'does not contain',
    condition: 'NOT LIKE',
    func: (e) => `%${e}%`,
  },
  {
    value: 4,
    label: 'starts with',
    condition: 'LIKE',
    func: (e) => `${e}%`,
  },
];
export default conditions;
