/* eslint react-hooks/exhaustive-deps: 0 */

import { useEffect } from 'react';

const useMount = effect => useEffect(effect, []);

export default useMount;
