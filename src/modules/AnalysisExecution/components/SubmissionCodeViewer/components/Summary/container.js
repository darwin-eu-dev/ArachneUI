/*
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
 * Created: December 20, 2017
 *
 */

import { Component } from 'react';
import { get, ContainerBuilder } from 'services/Utils';
import actions from 'actions';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

class SubmissionResultsummary extends Component {
  constructor() {
    super();
  }

  componentWillMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.analysisId !== nextProps.analysisId && nextProps.analysisId >= 0) {
      this.props.loadAnalysis({ id: nextProps.analysisId });
    }
  }

  render() {
    return presenter(this.props);
  }
}

const selectors = (new SelectorsBuilder()).build();

export default class SubmissionResultsummaryBuilder extends ContainerBuilder {
  getComponent() {
    return SubmissionResultsummary;
  }

  mapStateToProps(state, ownProps) {
    const {
      submissionId,
    } = ownProps;
    const analysisId = selectors.getAnalysisId(state);
    const submission = selectors.getSubmission(state, analysisId, submissionId);
    const resultInfo = get(submission, 'resultInfo', {});
    const analysis = selectors.getAnalysis(state);
    const submissionGroupType = selectors.getSubmissionType(state, analysisId, submissionId);

    return {
      analysis,
      analysisId,
      resultInfo,
      submissionGroupType,
      submission,
    };
  }

  getMapDispatchToProps() {
    return {
      loadAnalysis: actions.analysisExecution.analysis.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
    };
  }

}
