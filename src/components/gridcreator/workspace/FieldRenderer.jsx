import styles from './Inspector.module.css'

/**
 * FieldRenderer — generischer Renderer für die 4 v1-Field-Types aus
 * WORKSPACE_SPEC §13.1 (architektonische Klausel §13: der Inspector
 * ist datengetrieben, keine case-spezifische Logik).
 *
 *   role     → Dropdown, strikt (nur Schema-Optionen)
 *   select   → Dropdown, frei (Schema-Optionen)
 *   text     → Single-line Text-Input
 *   textarea → Multi-line Textarea
 *
 * Neue Field-Types werden hier additiv ergänzt.
 */
export default function FieldRenderer({ field, value, onChange, placeholder }) {
  const type = field?.type || 'text'

  if (type === 'role' || type === 'select') {
    const options = Array.isArray(field.options) ? field.options : []
    return (
      <select
        className={styles.select}
        value={value ?? ''}
        onChange={e => onChange(e.target.value || null)}
      >
        <option value="">—</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {String(opt).replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    )
  }

  if (type === 'textarea') {
    return (
      <textarea
        className={styles.textarea}
        value={value ?? ''}
        placeholder={placeholder ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    )
  }

  // text fallback
  return (
    <input
      className={styles.textInput}
      type="text"
      value={value ?? ''}
      placeholder={placeholder ?? ''}
      onChange={e => onChange(e.target.value)}
    />
  )
}
