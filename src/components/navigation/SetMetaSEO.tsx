import { Helmet as HelmetBase } from "react-helmet-async";

const Helmet = HelmetBase as unknown as React.FC<React.PropsWithChildren<any>>;

const SetMetaSEO = ({ params }: any) => {
  return (
    <Helmet>
      <title>{params.title}</title>
      <meta name="description" content={params.description} />
    </Helmet>
  );
};

export default SetMetaSEO;