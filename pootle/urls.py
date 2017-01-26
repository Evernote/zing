# -*- coding: utf-8 -*-
#
# Copyright (C) Pootle contributors.
# Copyright (C) Zing contributors.
#
# This file is a part of the Zing project. It is distributed under the GPL3
# or later license. See the LICENSE file for a copy of the license and the
# AUTHORS file for copyright and authorship information.

from django.conf.urls import include, url
from django.views.generic import TemplateView


urlpatterns = [
    # Allauth
    url(r'^accounts/', include('accounts.urls')),
    url(r'^accounts/', include('allauth.urls')),

    # Reports
    url(r'^admin/reports/', include('reports.urls')),
    url(r'', include('reports.profile_urls')),

    # External apps
    url(r'^contact/', include('contact.urls')),
    url(r'', include('pootle_profile.urls')),

    # Pootle URLs
    url(r'', include('pootle.views.urls')),
    url(r'', include('staticpages.urls')),
    url(r'^help/quality-checks/',
        TemplateView.as_view(template_name="help/quality_checks.html"),
        name='pootle-checks-descriptions'),
    url(r'', include('pootle_app.urls')),
    url(r'^projects/', include('pootle_project.urls')),
    url(r'', include('pootle_statistics.urls')),
    url(r'', include('pootle_store.urls')),
    url(r'', include('pootle_language.urls')),
    url(r'', include('pootle_translationproject.urls')),
]


# TODO: handler400
handler403 = 'pootle.core.views.permission_denied'
handler404 = 'pootle.core.views.page_not_found'
handler500 = 'pootle.core.views.server_error'
