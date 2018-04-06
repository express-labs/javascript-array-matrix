import ArrayMatrix from '../ArrayMatrix';

import {
  colorSizes,
  sizeExtensions,
  waistInseam,
} from '../../App/examples';

import {
  mutate,
  sizeExtensionMutation,
  sizeNameMutation,
  waistInseamMutation,
} from '../../App/mutate';

describe('ArrayMatrix', () => {
  global.performance = { now: () => {} };

  describe('ArrayMatrix Error Handling', () => {
    const arrayMatrix = new ArrayMatrix({
      data: mutate(colorSizes, [sizeNameMutation]),
      orders: ['colorName', 'size'],
    });
    it('should throw an error when asking for entry with one index', () => {
      const errorFn = () => {
        arrayMatrix.getEntry({ colorName: 'DUSTY MOSS' });
      };

      expect(errorFn).toThrow();
    });
    it('should throw an error when asking for vector with unknown index', () => {
      const errorFn = () => {
        arrayMatrix.getDimension({ unknownIndex: 'DUSTY MOSS' });
      };

      expect(errorFn).toThrow();
    });
    it('should throw an error when asking for vector with unknown label', () => {
      const errorFn = () => {
        arrayMatrix.getDimension({ colorName: 'CHEETO FINGER ORANGE' });
      };

      expect(errorFn).toThrow();
    });
    it('should throw an error when asking for a vector with no indices', () => {
      const errorFn = () => {
        arrayMatrix.getDimension();
      };

      expect(errorFn).toThrow();
    });
    it('should throw an error when index value is not a string or number', () => {
      const errorFn = () => {
        arrayMatrix.getDimension({ colorName: {} });
      };

      expect(errorFn).toThrow();
    });
  });

  describe('ArrayMatrix Methods', () => {
    const arrayMatrix = new ArrayMatrix({
      data: mutate(colorSizes, [sizeNameMutation]),
      orders: ['colorName', 'size'],
    });
    it('should return the matrix, axes, props as debug data', () => {
      expect(Object.keys(arrayMatrix.debug())).toEqual(['matrix', 'axes', 'props']);
    });
    it('should return the labels for colorName', () => {
      const labels = arrayMatrix.getAxisPoints('colorName');
      const expectedLabels = ['COBALT BLUE', 'FLOWER PETAL', 'CHIANTI', 'ENSIGN BLUE', 'ENGINE RED', 'DUSTY MOSS', 'PEONY', 'BRIGHT TAMALE', 'MILITARY', 'IMPALA', 'TRUE WHITE', 'PITCH BLACK', 'RED LACQUER', 'ROSE BUD', 'NEUTRAL', 'OLIVE GREEN'];

      const missingLabel = labels.find(label => expectedLabels.indexOf(label) === -1);

      expect(missingLabel).not.toBeTruthy();
      expect(labels.length).toBe(expectedLabels.length);
    });
    it('should return null non-existent label', () => {
      const labels = arrayMatrix.getAxisPoints('overalls');

      expect(labels).toBe(null);
    });
    it('should return the indices for getIndices', () => {
      const indices = arrayMatrix.getAxes();
      const expectedIndices = {
        size: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXXS', 'XXL', 'XXXL'],
        colorName: ['COBALT BLUE', 'FLOWER PETAL', 'CHIANTI', 'ENSIGN BLUE', 'ENGINE RED', 'DUSTY MOSS', 'PEONY', 'BRIGHT TAMALE', 'MILITARY', 'IMPALA', 'TRUE WHITE', 'PITCH BLACK', 'RED LACQUER', 'ROSE BUD', 'NEUTRAL', 'OLIVE GREEN'],
      };

      expect(indices).toEqual(expectedIndices);
    });
  });

  describe('2 Order ArrayMatrix', () => {
    const arrayMatrix = new ArrayMatrix({
      data: mutate(colorSizes, [sizeNameMutation]),
      orders: ['colorName', 'size'],
    });

    it('should return 6 skus when query by colorName MILITARY', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'MILITARY' });

      const skus = ['12350292', '12350308', '12350315', '12350322', '12350339', '12350346'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });

    it('should return 16 skus when query by size S', () => {
      const entries = arrayMatrix.getDimension({ size: 'S' });

      const skus = ['11026440', '14455575', '11026174', '10430309', '11026532', '13100902', '14242120', '13081881', '12350315', '10430576', '10430125', '10430217', '10430484', '12478330', '14242212', '14455483'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return 16 skus with null values when query by size XXL', () => {
      const entries = arrayMatrix.getDimension({ size: 'XXL' });

      const validEntries = entries.filter(entry => entry !== null);
      const nullEntries = entries.filter(entry => entry === null);

      const skus = ['14455612', '14242168', '14242250', '14455520'];

      const missingSku = validEntries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
      expect(nullEntries.length).toBe(12);
    });
    it('should return a sku with id 13100902 when asking for entry S, DUSTY MOSS', () => {
      const entry = arrayMatrix.getEntry({ size: 'S', colorName: 'DUSTY MOSS' });

      expect(entry.skuId).toBe('13100902');
    });
    it('should return a sku with id 11026426 when asking for entry 0, 0', () => {
      const entry = arrayMatrix.getEntry({ size: 0, colorName: 0 });

      expect(entry.skuId).toBe('11026426');
    });
    it('should return null when asking for entry XXL, COBALT BLUE', () => {
      const entry = arrayMatrix.getEntry({ size: 'XXL', colorName: 'COBALT BLUE' });

      expect(entry).toBe(null);
    });
  });
  describe('3 Order ArrayMatrix (Size Extensions)', () => {
    const arrayMatrix = new ArrayMatrix({
      data: mutate(sizeExtensions, [sizeExtensionMutation, sizeNameMutation]),
      orders: ['colorName', 'extension', 'size'],
    });

    it('should return 10 skus when query by colorName NAVY and extension Regular', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'NAVY', extension: 'Regular' });

      const skus = ['13050948', '13050955', '13050962', '13050979', '13050986', '13050993', '13050924', '13050931', '13051006', '13051075'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });

    it('should return 6 skus when query by colorName RUBY RED and extension Tall', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'RUBY RED', extension: 'Tall' });

      const skus = ['13330217', '13330224', '13330231', '13330248', '13330255', '13330262'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return 2 skus with 1 null values when query by colorName BLACK and size S', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'BLACK', size: 'S' });

      const validEntries = entries.filter(entry => entry !== null);
      const nullEntries = entries.filter(entry => entry === null);

      const skus = ['11471141'];

      const missingSku = validEntries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
      expect(nullEntries.length).toBe(1);
    });
    it('should return 2 skus when query by colorName WHITE and size M', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'WHITE', size: 'M' });

      const skus = ['11471042', '11471097'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return 6 skus when query by extension Regular and size M', () => {
      const entries = arrayMatrix.getDimension({ extension: 'Regular', size: 'M' });

      const skus = ['11979579', '13050962', '13330163', '11471158', '11471042', '11979494'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return a sku with id 13100902 when asking for entry S, NAVY, Regular', () => {
      const entry = arrayMatrix.getEntry({ size: 'S', colorName: 'NAVY', extension: 'Regular' });

      expect(entry.skuId).toBe('13050955');
    });
    it('should return null when asking for entry S, BLACK, Tall', () => {
      const entry = arrayMatrix.getEntry({ size: 'S', colorName: 'BLACK', extension: 'Tall' });

      expect(entry).toBe(null);
    });
    it('should throw an error when asking for entry with two indices', () => {
      const errorFn = () => {
        arrayMatrix.getEntry({ size: 'S', colorName: 'NAVY' });
      };

      expect(errorFn).toThrow();
    });
    it('should throw an error when asking for a vector with 1 index', () => {
      const errorFn = () => {
        arrayMatrix.getDimension({ extension: 'Regular' });
      };

      expect(errorFn).toThrow();
    });
  });
  describe('3 Order Array Matrix (Waist & Inseam)', () => {
    const arrayMatrix = new ArrayMatrix({
      data: mutate(waistInseam, [waistInseamMutation]),
      orders: ['colorName', 'waist', 'inseam'],
    });

    it('should return 3 skus when query by colorName BLUE and waist W30', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'BLUE', waist: 'W30' });

      const skus = ['11558019', '11558033', '11558057'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });

    it('should return 4 skus when query by colorName BLUE and waist W36', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'BLUE', waist: 'W36' });

      const skus = ['11558408', '11558422', '11558446', '11558460'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return 10 skus when query by colorName BLUE and inseam L30', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'BLUE', inseam: 'L30' });

      const skus = ['11556879', '11556947', '11558019', '11558088', '11558156', '11558231', '11558309', '11558408', '11558477', '11558545'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return 1 sku when query by waist W30 and inseam L30', () => {
      const entries = arrayMatrix.getDimension({ waist: 'W30', inseam: 'L30' });

      const skus = ['11558019'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return a sku with id 11556879 when asking for entry W28, BLUE, L30', () => {
      const entry = arrayMatrix.getEntry({ waist: 'W28', colorName: 'BLUE', inseam: 'L30' });

      expect(entry.skuId).toBe('11556879');
    });
    it('should return null when asking for entry W36, BLUE, L28', () => {
      const entry = arrayMatrix.getEntry({ waist: 'W36', colorName: 'BLUE', inseam: 'L28' });

      expect(entry).toBe(null);
    });
  });
  describe('4 Order Array Matrix (Size Extensions, Waist & Inseam)', () => {
    const arrayMatrix = new ArrayMatrix({
      data: mutate(waistInseam, [sizeExtensionMutation, sizeNameMutation, waistInseamMutation]),
      orders: ['colorName', 'extension', 'waist', 'inseam'],
    });

    it('should return 3 skus when query by colorName BLUE, extension Regular, and waist W30', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'BLUE', extension: 'Regular', waist: 'W30' });

      const skus = ['11558019', '11558033', '11558057'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return 10 skus when query by colorName BLUE, extension Regular and inseam L30', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'BLUE', extension: 'Regular', inseam: 'L30' });

      const skus = ['11556879', '11556947', '11558019', '11558088', '11558156', '11558231', '11558309', '11558408', '11558477', '11558545'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return 1 sku when query by colorName BLUE, waist W30 and inseam L30', () => {
      const entries = arrayMatrix.getDimension({ colorName: 'BLUE', waist: 'W30', inseam: 'L30' });

      const skus = ['11558019'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return 1 sku when query by extension Regular, waist W30 and inseam L30', () => {
      const entries = arrayMatrix.getDimension({ extension: 'Regular', waist: 'W30', inseam: 'L30' });

      const skus = ['11558019'];

      const missingSku = entries.find(entry => skus.indexOf(entry.skuId) === -1);

      expect(missingSku).not.toBeTruthy();
    });
    it('should return a sku with id 11556879 when asking for entry W28, BLUE, Regular, L30', () => {
      const entry = arrayMatrix.getEntry({ waist: 'W28', colorName: 'BLUE', extension: 'Regular', inseam: 'L30' });

      expect(entry.skuId).toBe('11556879');
    });
  });
});
