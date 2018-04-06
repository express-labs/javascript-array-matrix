const pipe = fns => item => fns.reduce((prev, fn) => fn(prev), item);

const mutate = (data, mutators) => {
  const mutations = pipe(mutators);
  return mutations(data);
};

export default mutate;
