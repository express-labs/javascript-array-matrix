const sizeExtensionMutation = data =>
  data.map((item) => {
    const extension = item.sizeExtension2 || 'Regular';

    return Object.assign({}, item, { extension });
  });

export default sizeExtensionMutation;
