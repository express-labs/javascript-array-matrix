const waistInseamMutation = data =>
  data.map((item) => {
    const sizeSplitter = item.sizeName.split(' ');

    return Object.assign({}, item, {
      waist: sizeSplitter[0],
      inseam: sizeSplitter[1],
    });
  });

export default waistInseamMutation;
