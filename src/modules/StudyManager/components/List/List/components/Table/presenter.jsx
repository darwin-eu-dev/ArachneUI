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
 * Created: August 30, 2017
 *
 */

import React, { PropTypes, Component } from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Table,
  TableCellText as Cell,
  TableCellStatus as CellStatus,
} from 'arachne-ui-components';
import TitleStudy from 'components/TitleStudy';

require('./style.scss');

function LeadList({ userLinkFormatter, value }) {
  const classes = new BEMHelper('cell-name');

  const fullTitle = value.map(userLinkFormatter).map(lead => lead.label).join(', ');

  return (
    <div {...classes()}>
        <span title={fullTitle} {...classes('title')}>
          {fullTitle}
        </span>
    </div>
  );
}

function CellName(props) {
  const classes = new BEMHelper('cell-name');
  return (
    <div {...classes()}>
      <TitleStudy
        {...props}
      />
    </div>
  );
}

function RoleCell({ value, index }) {
  const classes = new BEMHelper('cell-name');

  return (
    <div {...classes()}>
      <span title={value} key={'table-cell-text-span' + index} {...classes('title')}>
        {value}
      </span>
    </div>
  );
}

class TableStudies extends Component {
  constructor() {
    super();
    this.tableClasses = new BEMHelper('studies-table');
  }

  getColumns() {
    return [
      <CellName
        key="title"
        {...this.tableClasses('study')}
        header="Study"
        field="title"
        mods={['bold', 'nowrap', 'nooverflow']}
        props={study => ({
          ...study,
          isFavourite: study.favourite,
          title: study.title,
          showHover: true,
          toggleFavorite: () => this.props.setFavourite(
            study.id,
            (!study.favourite).toString()
          ),
        })}
      />,
      <LeadList
        key="leadList"
        {...this.tableClasses('lead')}
        header="PI"
        field="leadList"
        userLinkFormatter={this.props.userLinkFormatter}
      />,
      // <RoleCell
      //   key="role"
      //   {...this.tableClasses('role')}
      //   header="My role"
      //   field="role"
      // />,
      <Cell
        key="created"
        {...this.tableClasses('created')}
        header="Created"
        field="created"
        format={this.props.timestampFormatter}
      />,
      <Cell
        key="updated"
        {...this.tableClasses('updated')}
        header="Updated"
        field="updated"
        format={this.props.timestampFormatter}
      />,
        <Cell
            key="actionRequired"
            {...this.tableClasses('actionRequired')}
            header="Action Required"
            field="actionRequired"
            format={this.props.actionRequiredFormatter}
        />,
      // <Cell
      //   key="type"
      //   {...this.tableClasses('type')}
      //   header="Type"
      //   field="type"
      //   format={this.props.typeFormatter}
      // />,
      <CellStatus
        key="status"
        {...this.tableClasses('status')}
        header="Study status"
        field="status"
        format={this.props.statusFormatter}
      />
    ];
  }

  render () {
    const {
      data,
      sorting,
      setSorting,
      goToStudy,
    } = this.props;

    return (
      <div {...this.tableClasses()}>
        <Table
          {...this.tableClasses('table')}
          mods={['hover', 'selectable', 'padded']}
          data={data}
          sorting={sorting}
          setSorting={setSorting}
          onRowClick={({ id }) => goToStudy(id)}
        >
          {this.getColumns()}
        </Table>
      </div>
    );
  }
}

TableStudies.propTypes = {
  timestampFormatter: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  goToStudy: PropTypes.func.isRequired,
  userLinkFormatter: PropTypes.func.isRequired,
  setSorting: PropTypes.func.isRequired,
  sorting: PropTypes.object.isRequired,
  actionRequiredFormatter: PropTypes.func.isRequired,
  statusFormatter: PropTypes.func.isRequired,
  typeFormatter: PropTypes.func.isRequired,
  pages: PropTypes.number,
  path: PropTypes.string,
};

export default TableStudies;
