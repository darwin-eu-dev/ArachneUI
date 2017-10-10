/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: September 27, 2017
 *
 */

import { apiPaths } from 'modules/AnalysisExecution/const';
import Duck from 'services/Duck';

const coreName = 'AE_ANALYSIS_INSIGHT_COMMENT';

const duck = new Duck({
  name: coreName,
  urlBuilder: apiPaths.comments,
});

function flushComments() {
  return {
    type: `${coreName}_QUERY_FULFILLED`,
    payload: {
      result: {
        id: null,
        comments: [],
      },
    },
  };
}

function unload() {
  return dispatch => dispatch(flushComments());
}

export default {
  actions: {
    ...duck.actions,
    unload,
  },
  reducer: duck.reducer,
};