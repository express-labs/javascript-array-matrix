const sizeNameMutation = data =>
  data.map((item) => {
    const sizeName = ((name) => {
      switch (name.toLowerCase()) {
        case 'large':
          return 'L';
        case 'medium':
          return 'M';
        case 'small':
          return 'S';
        case 'x small':
          return 'XS';
        case 'x large':
          return 'XL';
        case 'xx small':
          return 'XXS';
        case 'xx large':
          return 'XXL';
        case 'xxx small':
          return 'XXXS';
        case 'xxx large':
          return 'XXXL';
        default:
          return name;
      }
    })(item.sizeExtension1 || item.sizeName);

    return Object.assign({}, item, { size: sizeName });
  });

export default sizeNameMutation;
