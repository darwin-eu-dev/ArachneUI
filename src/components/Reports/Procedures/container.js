/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: November 09, 2017
 *
 */

import TreemapReportBuilder from 'components/Reports/TreemapReport';
import presenter from './presenter';
import {
	boxplot,
	donut,
	line,
	trellisline,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';

export default class ProceduresBuilder extends TreemapReportBuilder {
  constructor() {
    super();
    this.presenter = presenter;
    this.filePath = 'procedures';
		this.detailsCharts = {
			conditionPrevalenceChart: new trellisline(),
			conditionByMonthChart: new line(),
			proceduresByTypeChart: new donut(),
			ageOfFirstOccurrenceChart: new boxplot(),
		}
  }

  getFilename(conceptId) {
    return `procedure_${conceptId}.json`;
  }
}

