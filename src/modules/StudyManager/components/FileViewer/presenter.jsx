/*
 *  Copyright 2017 Observational Health Data Sciences and Informatics
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  Company: Odysseus Data Services, Inc.
 *  Product Owner/Architecture: Gregory Klebanov
 *  Authors: Anton Gackovka
 *  Created: October 18, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { PageContent, LoadingPanel } from 'arachne-ui-components';
import MediaViewer from 'components/MediaViewer';
import Toolbar from './Toolbar/index';

require('./style.scss');

function StudyFileViewer({ language, isLoading, pageTitle, downloadLink, mimeType, content, name, title, createdAt }) {
  const classes = new BEMHelper('study-file');

  return (
    <PageContent title={pageTitle}>
      <div {...classes()}>
        <Toolbar />
        <div {...classes('content')}>
          <MediaViewer
            language={language}
            mimeType={mimeType}
            data={content}
            downloadLink={downloadLink}
            name={name}
            title={title}
            createdAt={createdAt}
          />
        </div>
        <LoadingPanel active={isLoading} />
      </div>
    </PageContent>
  );
}

export default StudyFileViewer;
