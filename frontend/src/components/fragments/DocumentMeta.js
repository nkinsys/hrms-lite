import { Helmet } from "react-helmet-async";

function DocumentMeta({ title, description, canonical, charset, tags }) {
    return (
        <Helmet>
            {/* Title */}
            {title && <title>{title}</title>}

            {/* Description */}
            {description && <meta name="description" content={description} />}

            {/* Canonical */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Charset */}
            {charset && <meta charSet={charset} />}

            {/* Other meta tags */}
            {tags &&
                Object.entries(tags).map(([key, value]) => {
                    if (!value) return null;

                    // Skip charset, already handled
                    if (key === "charset") return null;

                    // Handle property tags for Open Graph or special meta
                    if (value.property) {
                        return <meta key={key} property={key} content={value.content} />;
                    }

                    // Otherwise default to name attribute
                    return <meta key={key} name={key} content={value.content || value} />;
                })}
        </Helmet>
    );
}

export default DocumentMeta;