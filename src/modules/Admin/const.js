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
 * Created: February 09, 2017
 *
 */

import keyMirror from 'keymirror';
import { Utils } from 'services/Utils';

const forms = keyMirror({
  addAdminUser: null,
  addUserBatch: null,
  addUser: null,
});

const modal = keyMirror({
  addUser: null,
  addUserBatch: null,
  addAdminUser: null,
});

const apiPaths = {
  admins: ({ id, query }) => Utils.setUrlParams(`/api/v1/admin/admins${id ? `/${id}` : ''}`, query),
  tenantList: () => `/api/v1/tenants/list`,
  adminOptions: ({ query }) => `/api/v1/admin/admins/suggest?query=${query}`,
  solrIndex: ({ domain }) => `/api/v1/admin/${domain}/reindex-solr`,
  users: ({ id, query }) => Utils.setUrlParams(`/api/v1/admin/users${id ? `/${id}` : ''}`, query),
  userOptions: ({ query }) => `/api/v1/admin/users/suggest?query=${query}`,

  systemSettings: () => '/api/v1/admin/system-settings',
  engineStatus: () => '/api/v1/admin/execution-engine/status',

  restartServer: () => '/api/v1/admin/restart',
  ping: () => '/api/v1/auth/me',

  portalUsers: ({ id, query } = {}) => Utils.setUrlParams(`/api/v1/admin/users${id ? `/${id}` : ''}`, query),
  portalUsersIds: ({ query }) => Utils.setUrlParams(`/api/v1/admin/users/ids`, query),
  portalUsersUndeletableIds: ({ query }) => Utils.setUrlParams(`/api/v1/admin/users/ids/undeletable`, query),
  portalUsersEnable: ({ id, enable }) => `/api/v1/admin/users/${id}/enable/${enable}`,
  portalUsersConfirmEmail: ({ id, confirm }) => `/api/v1/admin/users/${id}/confirm-email/${confirm}`,
  portalUsersBatch: () => '/api/v1/admin/users/batch',
  usersGroup: () => '/api/v1/admin/users/group',
};

const paths = {
  admins: () => '/admin-settings/admins',
  systemSettings: () => '/admin-settings/system-settings',
  operationalDashboard: () => '/admin-settings/operational-dashboard',
  users: () => '/admin-settings/users',
  tenants: () => '/admin-settings/tenants',
};

const imgs = {
  sidebarIco: '/img/icons/Universal_Desktop/Navigation/Arachne_Desktop_icon-Data_Catalog.png',
};

const adminPages = [ // eslint-disable-line import/no-mutable-exports
  { 
    label: 'Admin users',
    value: paths.admins() 
  },
  
  {
    label: 'System Settings',
    value: paths.systemSettings(),
  },
];

if (__APP_TYPE_CENTRAL__) {
  adminPages.push({ label: 'Users', value: paths.users() });
}

if (__APP_TYPE_NODE__) {
  adminPages.push({ label: 'Operational Dashboard', value: paths.operationalDashboard() });
}

const solrDomains = {
  users: {
    value: 'users',
    label: 'Users',
  },
  dataSources: {
    value: 'data-sources',
    label: 'Data sources',
  },
  studies: {
    value: 'studies',
    label: 'Studies',
  },
  analyses: {
    value: 'analyses',
    label: 'Analyses',
  },
  papers: {
    value: 'papers',
    label: 'Papers',
  },
};

const batchOperationType = keyMirror({
  RESEND: null,
  ENABLE: null,
  CONFIRM: null,
  DELETE: null,
});

export {
  adminPages,
  apiPaths,
  forms,
  imgs,
  modal,
  paths,
  solrDomains,
  batchOperationType,
};
