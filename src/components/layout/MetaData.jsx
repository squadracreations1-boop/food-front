import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaData = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{`${title} - Maitreyi Foods`}</title>
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={`${title} - Maitreyi Foods`} />
            {description && <meta property="og:description" content={description} />}
            <meta property="og:url" content="https://maitreyifoods.com/" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${title} - Maitreyi Foods`} />
            {description && <meta name="twitter:description" content={description} />}
        </Helmet>
    );
};

export default MetaData;
