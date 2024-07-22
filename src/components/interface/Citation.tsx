const Citation = ({content}:any) => {
  return (
      <section className='citation'>
          <blockquote>{content.citation}</blockquote>
          <p>{content.auteur}</p>
      </section>
  )
}

export default Citation