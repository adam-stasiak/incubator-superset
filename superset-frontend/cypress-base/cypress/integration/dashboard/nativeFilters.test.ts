/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { TABBED_DASHBOARD } from './dashboard.helper';

describe('Nativefilters', () => {
  let filterId: number;
  let aliases: string[];


  beforeEach(() => {
    cy.login();
    cy.server();
    cy.visit(TABBED_DASHBOARD);
  });
  it('should show filter bar and allow user to create filters ', () => {
    cy.get('[data-test="filter-bar"]').should('be.visible');
    cy.get('[data-test="collapse"]').click();
    cy.get('[data-test="create-filter"]').click();
    cy.get('.ant-modal').should('be.visible');

    cy.get('.ant-modal')
      .find('[data-test="name-input"]')
      .click()
      .type('Country name');

    cy.get('.ant-modal').find('[data-test="datasource-input"]').click();

    cy.get('[data-test="datasource-input"]')
      .contains('wb_health_population')
      .click();

    // hack for unclickable country_name
    cy.get('.ant-modal').find('[data-test="field-input"]').type('country_name');
    cy.get('.ant-modal')
      .find('[data-test="field-input"]')
      .type('{downarrow}{downarrow}{enter}');

    cy.get('.ant-modal-footer')
      .find('.ant-btn-primary')
      .should('be.visible')
      .click();
  });

  it('should show newly added filter in filter bar menu', () => {
    cy.get('[data-test="filter-bar"]').should('be.visible');
    cy.get('[data-test="filter-control-name"]').should('be.visible');
    cy.get('[data-test="form-item-value"]').should('be.visible');
  });
  it('should filter dashboard with selected filter value', () => {
    cy.get('[data-test="form-item-value"]').should('be.visible').click();
    cy.get('.ant-select-selection-search').type('Hong Kong{enter}');
    cy.get('[data-test="filter-apply-button"]').click();
    cy.get('.treemap').within(() => {
      cy.contains('CHN').should('be.visible');
      cy.contains('USA').should('not.exist');
    });
  });
  it('should stop filtering when filter is removed', () => {
    cy.get('[data-test="create-filter"]').click();
    cy.get('.ant-modal').should('be.visible');
    cy.get('.ant-tabs-nav-list').within(() => {
      cy.get('.ant-tabs-tab-remove').click();
    });
    cy.get('.ant-modal-footer')
      .find('.ant-btn-primary')
      .should('be.visible')
      .click();
      cy.get('.treemap').within(() => {
        cy.contains('CHN').should('be.visible');
        cy.contains('USA').should('be.visible');
      });
  });
});
