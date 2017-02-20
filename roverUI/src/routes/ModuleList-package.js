import FourOhFour from './FourOhFour';
import Overview from './overview/Overview';
import Resources from './resources/Resources';
import Query from './resources/Query';

// grouping modules into a nice package ;)
// remember any "Routed Page" must export all dependent modules it uses inside its container as well as itself
export default { FourOhFour, Overview, Resources, Query };