import { Helmet } from 'react-helmet-async';

const SetMetaSEO = ({params}:any) => {
    return (
      <Helmet>
        <title>{params.title}</title>
        <meta name="description" content={params.description} />
      </Helmet>
    )
}

export default SetMetaSEO