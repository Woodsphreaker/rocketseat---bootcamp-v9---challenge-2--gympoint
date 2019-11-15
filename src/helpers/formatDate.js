import { format } from 'date-fns'
import pt from 'date-fns/locale/pt'

export default date => {
  return format(date, 'dd \'de\' MMMM \'de\' yyyy \'às\' hh:mm:ssxxx', {
    locale: pt,
  })
}
