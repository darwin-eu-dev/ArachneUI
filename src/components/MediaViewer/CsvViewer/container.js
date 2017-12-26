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
 * Created: December 19, 2017
 *
 */

import { Component } from 'react';
import presenter from './presenter';

export default class CsvViewer extends Component {
  constructor() {
    super();
    this.state = {
      widths: null,
    };
    this.setThWidths = this.setThWidths.bind(this);
  }

  setThWidths(headers) {
    if (headers instanceof NodeList && headers.length) {
      const widths = [];
      headers.forEach((header, index) => {
        const bounds = header.getBoundingClientRect();
        widths[index] = `${bounds.width}px`;
      });
      this.setState({
        widths,
      });
    }
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      setThWidths: this.setThWidths,
    });
  }
}
