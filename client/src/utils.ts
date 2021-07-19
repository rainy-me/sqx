// @ts-ignore
export const extractData = ({ data }: any) => ({
  fields: data?.fields ?? [],
  results: data?.results ?? [],
});
