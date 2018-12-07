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
 * Created: December 14, 2016
 *
 */

import keyMirror from 'keymirror';
import { FormInput, FormSelect } from 'arachne-ui-components';
import PasswordField from 'components/PasswordField/connected';
import StatefulFormAutocomplete from 'components/StatefulFormAutocomplete';

const form = keyMirror({
  remindPassword: null,
  resetPassword: null,
});

const actionTypes = keyMirror({
  AU_PRINCIPAL_QUERY_FULFILLED: null,
});

const loginMessages = {
  registered: 'registered',
  emailConfirmed: 'email-confirmed',
  remindDone: 'password-remind-done',
  resetDone: 'password-reset-done',
  resendDone: 'email-resend-done',
};

const autocompleteResultsLimit = 10;

const paths = {
  login(message) {
    const messageParam = message ? `?message=${message}` : '';
    return `/auth/login${messageParam}`;
  },
  register: () => '/auth/register',
  remindPassword: () => '/auth/remind-password',
  welcome: () => '/auth/welcome',
  resetPassword: () => '/auth/reset-password',
};

const apiPaths = {
  //
  professionalTypes: id => `/api/v1/user-management/professional-types${id ? `/${id}` : ''}`,
  //
  login: () => '/api/v1/auth/login',
  logout: () => '/api/v1/auth/logout',
  register: () => '/api/v1/auth/registration',
  remindPassword: () => '/api/v1/auth/remind-password',
  resetPassword: () => '/api/v1/auth/reset-password',
  resendEmail: () => '/api/v1/auth/resend-activation-email',
  //
  principal: () => '/api/v1/auth/me',
  authMethod: () => '/api/v1/auth/method',
  refresh: () => '/api/v1/auth/refresh',
  //
  passwordPolicy: () => '/api/v1/auth/password-policies',
  searchCountry: ({ query, includeId } = {}) =>
    `/api/v1/user-management/countries/search?limit=${autocompleteResultsLimit}&query=${query}${includeId ? `&includeId=${includeId}` : ''}`,
  searchProvince: ({ countryId, query, includeId } = {}) =>
    `/api/v1/user-management/state-province/search?limit=${autocompleteResultsLimit}&query=${query}&countryId=${countryId}${includeId ? `&includeId=${includeId}` : ''}`,
};

const authMethods = keyMirror({
  LDAP: null,
  NATIVE: null,
});

const registerFields = function ({ professionalTypesOptions,
                                   countries,
                                   provinces,
                                   searchCountries,
                                   storeCountry,
                                   searchProvinces,
                                   storeProvince, }) {

  return [
    {
      name: 'firstname',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'First Name',
          type: 'text',
          required: true,
        },
      },
    },
    {
      name: 'address.address1',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Address',
          type: 'text',
        }
      }
    },
    {
      name: 'middlename',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Middle Name',
          type: 'text',
        },
      },
    },
    {
      name: 'address.city',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'City',
          type: 'text',
          required: true,
        }
      }
    },
    {
      name: 'lastname',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Last Name',
          type: 'text',
          required: true,
        },
      },
    },
    {
      name: 'address.zipCode',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Zip code',
          type: 'text',
          required: true,
        }
      }
    },
    {
      name: 'email',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Email',
          type: 'text',
          required: true,
        },
      },
    },
    {
      name: 'address.country',
      InputComponent: {
        component: StatefulFormAutocomplete,
        props: {
          mods: ['bordered'],
          placeholder: 'Country',
          required: true,
          options: countries,
          fetchOptions: searchCountries,
          clearable: false,
          onSelectResetsInput: true,
          onBlurResetsInput: true,
          storeSelectedOption: storeCountry,
        }
      }
    },
    {
      name: 'password',
      InputComponent: {
        component: PasswordField,
        props: {
          mods: ['bordered'],
          required: true,
        },
      },
    },
    {
      name: 'address.stateProvince',
      InputComponent: {
        component: StatefulFormAutocomplete,
        props: {
          mods: ['bordered'],
          placeholder: 'State/Province',
          options: provinces,
          fetchOptions: searchProvinces,
          clearable: false,
          onSelectResetsInput: true,
          onBlurResetsInput: true,
          storeSelectedOption: storeProvince,
        }
      }
    },
    {
      name: 'passwordConfirmation',
      InputComponent: {
        component: PasswordField,
        props: {
          mods: ['bordered'],
          placeholder: 'Confirm password',
          required: true,
          showHint: false,
        },
      },
    },
    {
      name: 'address.mobile',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Mobile',
          type: 'text',
        }
      }
    },
    {
      name: 'organization',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Organization',
          type: 'text',
          required: true,
        },
      },
    },
    {
      name: 'department',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Department',
          type: 'text',
        }
      },
    },
    {
      name: 'professionalTypeId',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Professional type',
          options: professionalTypesOptions,
        },
      },
    },
  ];
}

export {
  actionTypes,
  authMethods,
  apiPaths,
  autocompleteResultsLimit,
  form,
  loginMessages,
  paths,
  registerFields,
};
