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
 * Created: August 25, 2017
 *
 */

// @ts-check
import { Component } from 'react';
import { push as goToPage } from 'react-router-redux';
import { paths } from 'modules/InsightsLibrary/const';
import viewModes from 'const/viewModes';
import URI from 'urijs';
import { Utils, ContainerBuilder, get } from 'services/Utils';
import actions from 'actions';
import { saveFilter } from 'modules/InsightsLibrary/ducks/insights';
import InsightsList from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
export default class InsightsListBuilder extends ContainerBuilder {
  getComponent() {
    return InsightsList;
  }

  mapStateToProps(state) {
    const searchQuery = get(state, 'routing.locationBeforeTransitions.query', {}, 'Object');

    return {
      insightList: selectors.getInsightList(state),
      searchQuery,
      sorting: {
        sortBy: searchQuery.sortBy || 'study.endDate',
        sortAsc: searchQuery.sortAsc === 'true',
      },
      isCardsView: searchQuery.view === viewModes.CARDS,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      showInsight: insight => goToPage(paths.insights({ insightId: insight.id })),
      search: (searchParams) => {
        const url = new URI(paths.insights());
        url.setSearch(searchParams);
        return goToPage(url.href());
      },
      doSetFavourite: (insightId, isFavourite) =>
        actions.insightsLibrary.insightFavourites.update(insightId, {
          value: isFavourite,
        }),
      loadInsightsWithCurrentQuery: searchQuery =>
        actions.insightsLibrary.insights.query(null, searchQuery),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      setSorting: (sortParams) => {
        const searchParams = {
          ...stateProps.searchQuery,
          ...sortParams,
        };
        dispatchProps.search(searchParams);
      },
      setFavourite(insightId, isFavourite) {
        dispatchProps.doSetFavourite(insightId, isFavourite)
          .then(() => dispatchProps.loadInsightsWithCurrentQuery(stateProps.searchQuery));
      },
    };
  }

}