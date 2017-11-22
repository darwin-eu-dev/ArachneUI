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
 * Created: November 20, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  treemap,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import Table from 'components/Charts/Table';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';
import { convertDataToTreemapData } from 'components/Reports/converters';
import get from 'lodash/get';
import ProceduresByIndexDetails from './ProceduresByIndexDetails';
import Chart from 'components/Reports/Chart';

import './style.scss';

function ProceduresByIndex(props) {
  const {
    conditions,
    loadConditionDetails,
    details,
    onZoom,
    initialZoomedConcept,
    tableData,
    tableColumns,
  } = props;
  const classes = new BEMHelper('report-proc-by-index');
  const dataPresent = conditions && conditions.PERCENT_PERSONS && conditions.PERCENT_PERSONS.length;
  const table = <Table
    data={tableData}
    columns={tableColumns}
    pageSize={5}
    onRowClick={node => loadConditionDetails(node.id.value)}
  />;

  return (
    <div {...classes()}>
      <div className='row'>
        <div className='col-xs-12'>
          <Chart
            title='Procedures'
            isDataPresent={dataPresent}
            isTreemap
            table={table}
            render={({ width, element }) => {
              const height = width/3;
              const minimum_area = 50;
              const threshold = minimum_area / (width * height);
              new treemap().render(
                convertDataToTreemapData(conditions, threshold, {
                  numPersons: 'NUM_PERSONS',
                  id: 'CONCEPT_ID',
                  path: 'CONCEPT_PATH',
                  pctPersons: 'PERCENT_PERSONS',
                  recordsPerPerson: 'RISK_DIFF_AFTER_BEFORE',
                }),
                element,
                width,
                height,
                {
                  ...chartSettings,
                  onclick: node => loadConditionDetails(node.id),
                  getsizevalue: node => node.numPersons,
                  getcolorvalue: node => node.recordsPerPerson,
                  getcontent: (node) => {
                    let result = '';
                    const steps = node.path.split('||');
                    const i = steps.length - 1;
                    result += `<div class='pathleaf'>${steps[i]}</div>`;
                    result += `<div class='pathleafstat'>
                      Prevalence: ${new treemap().formatters.format_pct(node.pctPerson)}
                    </div>`;
                    result += `<div class='pathleafstat'>
                      Number of People: ${new treemap().formatters.format_comma(node.numPersons)}
                    </div>`;
                    result += `<div class='pathleafstat'>
                      Relative Risk per Person: ${new treemap().formatters.format_fixed(node.recordsPerPerson)}
                    </div>`;
                    return result;
                  },
                  gettitle: (node) => {
                    let title = ''
                    const steps = node.path.split('||');
                    steps.forEach((step, i) => {
                      title += ` <div class='pathstep'>${Array(i + 1).join('&nbsp;&nbsp')}${step}</div>`;
                    });
                    return title;
                  },
                  useTip: true,
                  getcolorrange: () => d3.schemeCategory20c.slice(1),
                  onZoom: onZoom,
                  initialZoomedConcept: initialZoomedConcept,
                }
              )
            }}
          />
        </div>
      </div>
      {details && <ProceduresByIndexDetails
        conditions={get(details, 'procedureByIndex', {})}
        details={{}}
      />
      }
    </div>
  );
}

export default ProceduresByIndex;
