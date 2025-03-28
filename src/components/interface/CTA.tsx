const CTA = ({ data }: any) => {
  if (!data) return null;
  

  return (
    <section className="cta center">
      <a
        className="primary-button"
        href={data.link}
        target={data.Ouvrir_dans_une_nouvelle_fenetre ? "_blank" : ""}
        title={data.attribut_title}
        style={{
          backgroundColor: data.background_color || "#009C1A", // Couleur de fond par défaut
          borderColor: data.background_color,
          color: data.font_color || "#ffffff", // Couleur du texte par défaut
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = data.hover_background_color || "#007A16";
          e.currentTarget.style.borderColor = data.hover_background_color || "#007A16";
          e.currentTarget.style.color = data.hover_font_color || "#ffffff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = data.background_color || "#009C1A";
          e.currentTarget.style.borderColor = data.background_color || "#009C1A";
          e.currentTarget.style.color = data.font_color || "#ffffff";
        }}
      >
        {data.texte}
      </a>
    </section>
  );
};

export default CTA;
