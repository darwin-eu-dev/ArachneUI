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
 * Created: January 31, 2018
 *
 */

import { createSelector } from 'reselect';
import { get, Utils } from 'services/Utils';
import DsAttrListSelector from 'modules/DataCatalog/selectors/DsAttrListSelector';

class DataCatalogListViewAttributesSelectorsBuilder extends DsAttrListSelector {

  getRawData(state) {
    return get(state, 'dataCatalog.dataSource.data.result', {}, 'Object');
  }

  getData(rawDs, attrList) {
    const attributes = {};

    attrList.forEach((attribute) => {
      const value = get(rawDs, attribute.name);
      if (value) {
        attributes[attribute.name] = Utils.castValue(value, attribute);
      }
    });

    return attributes;
  }

  buildSelectorForGetData(getAttrList) {
    return createSelector(
      [this.getRawData, getAttrList],
      this.getData
    );
  }

  build() {
    const getAttrList = this.buildSelectorForGetAttrList();
    const getAttrValues = this.buildSelectorForGetData(getAttrList);

    return {
      getAttrList,
      getAttrValues,
    };
  }

}

export default DataCatalogListViewAttributesSelectorsBuilder;
