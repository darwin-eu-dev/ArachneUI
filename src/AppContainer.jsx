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
 * Created: December 27, 2016
 *
 */

import React, { Component, PropTypes } from 'react';

import imgs from 'const/imgs';
import { Header, ModalUtils } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { connect } from 'react-redux';
import actions from 'actions';
import { get } from 'services/Utils';

import AboutInfo from 'modules/Portal/components/AboutInfo';
import Sidebar from 'components/Sidebar';
import { modal } from 'modules/Portal/const';
import { asyncConnect } from 'redux-async-connect';
import { nodeFunctionalModes } from 'modules/Auth/const';

class AppContainer extends Component {
  componentDidMount() {
    if (__APP_TYPE_NODE__) {
      this.props.getNodeMode();
      this.props.getAuthMode();
    }
    if (__APP_TYPE_CENTRAL__) {
      this.props.getPasswordPolicies();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentLocation !== nextProps.currentLocation) {
      this.props.refreshToken()
        .catch(() => this.props.logout(`${this.props.currentLocation}${this.props.currentSearch}`));
    }
    if (this.props.isUserAuthed !== nextProps.isUserAuthed) {
      setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    }
    if (__APP_TYPE_NODE__ && this.props.runningMode !== nextProps.runningMode
        && nextProps.runningMode === nodeFunctionalModes.Network) {
      this.props.getPasswordPolicies();
    }
  }

  render() {
    const classes = new BEMHelper('root');
    const colorScheme = __APP_TYPE_NODE__ ? 'node' : 'default';
    const {
      isUserAuthed = false,
      sidebarTabList = [],
      showAboutInfo = () => {},
      children = null,
    } = this.props;

    return (
      <div {...classes()}>
        <Header
          {...classes('header')}
          isUserAuthed={isUserAuthed}
          logo={imgs.header.logo}
          navItems={isUserAuthed ? AppContainer.navItems : []}
        />
        <div {...classes('main')}>
          {isUserAuthed &&
            <Sidebar
              {...classes('sidebar')}
              tabList={sidebarTabList}
              showAboutInfo={showAboutInfo}
              colorScheme={colorScheme}
            />
          }
          <div {...classes({ element: 'content', modifiers: {'left-padded': isUserAuthed}})}>
            {children}
          </div>
        </div>
        <AboutInfo />
      </div>
    );
  }
}

AppContainer.propTypes = {
  children: PropTypes.node.isRequired,
  isUserAuthed: PropTypes.bool.isRequired,
  navItems: PropTypes.node,
  sidebarTabList: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  const sidebarTabList = [];

  const isUserAdmin = get(state, 'auth.principal.queryResult.result.isAdmin');
  const modules = get(state, 'modules.list');
  const currentLocation = get(state, 'routing.locationBeforeTransitions.pathname', '');
  const currentSearch = get(state, 'routing.locationBeforeTransitions.search', '');
  const runningMode = get(state, 'auth.nodeMode.data.mode');

  if (modules) {
    const activeModule = modules.filter(m => m.path === state.modules.active)[0] || {};
    modules.forEach((module) => {
      if (module.sidebar) {
        if (module.isAdminOnly && !isUserAdmin) {
          return;
        }
        if (runningMode === nodeFunctionalModes.Standalone && module.path === 'external-resource-manager') {
          return;
        }

        const tab = { ...module.sidebar };

        if ((activeModule.sidebarPath || activeModule.path) === module.path) {
          tab.isSelected = true;
        }


        sidebarTabList.push(tab);
      }
    });
  }

  const isUserAuthed = !!get(state, 'auth.principal.queryResult.result.id') || !!get(state, 'auth.principal.queryResult.result.username');

  return {
    isUserAuthed,
    sidebarTabList,
    currentLocation,
    currentSearch,
    runningMode,
  };
}

const mapDispatchToProps = {
  showAboutInfo: () => ModalUtils.actions.toggle(modal.portalAboutInfo, true),
  refreshToken: () => actions.auth.token.refresh(),
  logout: (backurl) => actions.auth.clearToken(backurl),
  getPasswordPolicies: () => actions.auth.passwordPolicy.findUnsecured(),
  getNodeMode: () => (__APP_TYPE_NODE__) ? actions.auth.nodeMode.findUnsecured() : true,
  getAuthMode: () => (__APP_TYPE_NODE__) ? actions.auth.authMode.find() : true
};

export default (navItems) => {
  AppContainer.navItems = navItems;
  const connectedAppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainer);
  return asyncConnect([{
    promise: ({ store: { dispatch } }) => {
      const result = dispatch(actions.auth.principal.query());
      return result;
    },
  }])(connectedAppContainer);
};
