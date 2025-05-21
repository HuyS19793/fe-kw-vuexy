// Component Imports
import ComingSoon from '@views/misc/ComingSoon'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

const ComingSoonPage = () => {
  // Vars
  const mode = getServerMode()

  return <ComingSoon mode={mode} />
}

export default ComingSoonPage
