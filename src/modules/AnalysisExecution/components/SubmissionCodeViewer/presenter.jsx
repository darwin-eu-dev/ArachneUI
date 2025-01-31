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
 * Created: June 13, 2017
 *
 */

import React from 'react';
import FileViewer from 'components/FileViewer';
import FileBrowser from 'components/FileBrowser';
import FileTreeUtils from 'services/FileTreeUtils';
import { get } from 'services/Utils';
import BEMHelper from 'services/BemHelper';
import ModalUploadResult from 'modules/AnalysisExecution/components/ViewEditAnalysis/ModalUploadResult';
import ReportViewer from './ResultFile/components/ReportViewer';
import Summary from './ResultFile/components/Summary';
import EmptyState from 'components/EmptyState';

import './style.scss';

function createBreadcrumbs(path) {
  const classes = BEMHelper('result-file-breadcrumbs');

  return (
    <div {...classes()}>
      {path
        .split(FileTreeUtils.PATH_SEPARATOR)
        .filter(part => part)
        .reduce((splittedPath, part) => {
          return [
            ...splittedPath,
            <span {...classes('part')}>/</span>,
            <span {...classes('part')}>{part}</span>,
          ];
        }, [])
      }
    </div>
  );
}

function SubmissionCodeViewer({
  file,
  isLoading,
  toolbarOpts,
  downloadLink,
  urlParams,
  pageTitle,
  isReport = false,

  treeData,
  toggleFolder,
  openFile,
  selectedFilePath,
  isTreeLoading,

  submissionId,
  submissionGroupId,
  permissions,
  doDelete,
  showUploadModal,
  onUpload,
  summary,
  canView,
}) {
  const classes = BEMHelper('result-file-tree-add-icon');

  let headerBtns = null;
  if (permissions.upload) {
    headerBtns = (
      <div>
        <span {...classes()} onClick={() => showUploadModal(submissionId)}>
          add_circle_outline
        </span>
      </div>
    );
  }

  const viewer = canView ? (<FileBrowser
    selectedFile={urlParams.fileId}
    toolbarOpts={toolbarOpts}
    toggleFolder={toggleFolder}
    openFile={openFile}
    fileTreeData={treeData}
    isTreeLoading={isTreeLoading}
    selectedFilePath={selectedFilePath}
    urlParams={urlParams}
    permissions={permissions}
    doDelete={doDelete}
    headerBtns={headerBtns}
    summary={summary}
    detailsComponent={
      isReport
        ? <ReportViewer
          file={{
            ...file,
            label: createBreadcrumbs(get(file, 'relativePath', '', 'String')),
          }}
          downloadLink={downloadLink}
          pageTitle={pageTitle}
          isLoading={isLoading}
          submissionId={submissionId}
          submissionGroupId={submissionGroupId}
        />
        : <FileViewer
          file={{
            ...file,
            label: createBreadcrumbs(get(file, 'relativePath', '', 'String')),
          }}
          downloadLink={downloadLink}
          pageTitle={pageTitle}
          isLoading={isLoading}
        />
    }
    mainInfoComponent={<Summary
      submissionId={submissionId}
    />}
  >
    <ModalUploadResult onUpload={onUpload} />
  </FileBrowser>) : (<EmptyState message={'Access denied or submission does not exist'} />);

  return (
    viewer
  );
}

export default SubmissionCodeViewer;
