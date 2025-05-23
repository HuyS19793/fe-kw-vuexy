const URLS = {
  proxy: {
    accounts: '/account/',
    campaigns: '/campaign/',
    adgroups: '/adgroup/',
    keywords: '/keyword/',
    exportKeywords: '/keyword/export/',

    // Twitter
    getTokenX: '/twitter-auth-token/get-token/',
    redirectX: '/twitter-auth-token/redirect/',
    crawlX: '/crawl/user/',
    syncAccountX: '/crawl/account/',

    // Blacklist keywords
    blacklistKeywords: '/blacklist-keywords/',

    // Settings
    campaignSetting: '/campaign/settings/',
    adgroupSetting: '/adgroup/settings/',

    // Bulk settings
    bulkSettingTemplate: '/bulk-setting/template/download/',
    bulkSettingUpload: '/bulk-setting/upload/'
  },
  api: {
    redirectX: '/api/credential/x/redirect',
    bulkTemplate: '/api/template',
    bulkUpload: '/api/upload'
  }
}

export default URLS
