interface SectionPlaceholderProps {
  title: string
  description: string
}

export function SectionPlaceholder({ title, description }: SectionPlaceholderProps) {
  return (
    <section className='placeholder-card'>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}
