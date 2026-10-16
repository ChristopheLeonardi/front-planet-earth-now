import { useState, useEffect } from "react";
import Entete from "./interface/Entete";
import utils from "../services/utils";

interface EnteteAccueilProps {
  heading?: any;
  image?: {
    data?: {
      attributes?: {
        url?: string;
        formats?: Record<string, { url: string }>;
      };
    };
  };
  params?: string;
  CTA?: boolean;
  design?: { color?: string; background_color?: string };
}

const EnteteAccueil = ({
  heading,
  image,
  params = "",
  design = { color: "", background_color: "" },
  CTA = false,
}: EnteteAccueilProps) => {
  const [color, setColor] = useState("#fff");
  const [background, setBackground] = useState("#009C1A");

  useEffect(() => {
    if (design.color) setColor(design.color);
    if (design.background_color) setBackground(design.background_color);
  }, [design]);

  // Construire les URLs des différents formats
  const attributes = image?.data?.attributes;
  const fallback = attributes?.url ? utils.setUrl(attributes.url) : "";
  const formats = attributes?.formats ?? {};

  const cssVars = {
    "--bg-small": formats.small
      ? `url(${utils.setUrl(formats.small.url)})`
      : `url(${fallback})`,
    "--bg-medium": formats.medium
      ? `url(${utils.setUrl(formats.medium.url)})`
      : `url(${fallback})`,
    "--bg-large": formats.large
      ? `url(${utils.setUrl(formats.large.url)})`
      : `url(${fallback})`,
  } as React.CSSProperties;

  return (
    <section
      className={`entete-section-container ${params}`}
      style={cssVars}
    >
      {heading?.titre && (
        <div
          className="entete-container"
          style={{ color, backgroundColor: background }}
        >
          <Entete content={heading} CTA={CTA} />
        </div>
      )}
    </section>
  );
};

export default EnteteAccueil;