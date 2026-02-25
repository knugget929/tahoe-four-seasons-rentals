export function itineraryToMarkdown(itinerary, poiById) {
  if (!itinerary?.days?.length) return ''

  const lines = []
  lines.push(`# ${itinerary.title || 'Itinerary'}`)
  lines.push('')

  itinerary.days.forEach((day) => {
    lines.push(`## ${day.label}`)
    lines.push('')
    ;(day.stops || []).forEach((s, idx) => {
      const poi = poiById?.get?.(s.poi_id)
      const name = poi?.name || s.poi_id
      lines.push(`${idx + 1}. **${name}** — _${s.time_block}_, ${s.duration_min} min`) 
      lines.push(`   - ${s.label}`)
      lines.push(`   - Why: ${s.why}`)
      if (Array.isArray(s.tips) && s.tips.length) {
        lines.push(`   - Tips: ${s.tips.join(' | ')}`)
      }
    })
    lines.push('')
  })

  return lines.join('\n')
}
