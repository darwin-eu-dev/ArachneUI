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
 * Created: August 25, 2017
 *
 */

import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import { dataSourcePermissions } from 'modules/DataCatalog/const';
import actions from 'actions';
import get from 'lodash/get';
import { Utils } from 'services/Utils';
import { paths } from 'modules/DataCatalog/const';
import ToolbarActions from './presenter';

function mapStateToProps(state, ownProps) {
  const datasourceData = get(state, 'dataCatalog.dataSource.data.result');
  const isPublished = get(datasourceData, 'published', '');
  const isUnpublishable = get(datasourceData, `permissions[${dataSourcePermissions.delete}]`, false);
  const canUnpublish = isPublished && isUnpublishable;
  const dataSourceId = get(datasourceData, 'id', '');

  return {
    canUnpublish: ownProps.mode === 'edit' ? canUnpublish : false,
    canEdit: ownProps.mode === 'view' ? isUnpublishable : false,
    dataSourceId,
  };
}

const mapDispatchToProps = {
  load: actions.dataCatalog.dataSource.find,
  unpublish: actions.dataCatalog.dataSource.unpublish,
  goToPage,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    async unpublish() {
      try {
        await Utils.confirmDelete();
        const dataSourceId = stateProps.dataSourceId;
        await dispatchProps.unpublish({ id: dataSourceId });
        await dispatchProps.load({ id: dataSourceId });
        await dispatchProps.goToPage(paths.dataCatalog());
      } catch (er) {}
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ToolbarActions);
