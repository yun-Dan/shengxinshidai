export default {
  editUserInfo (state, data) {
    state.userInfo = data
  },
  editIsCollapse(state) {
    state.isCollapse = !state.isCollapse;
  },
  editShowCollapse(state) {
    state.showCollapse = !state.showCollapse;
  },
  editCrumbs(state, data) {
    state.crumbs = data;
  },
  editUsersList(state, data) {
    state.usersData = data;
  },
  editUserId(state, data) {
    state.userId = [data];
  },
  editStructuresList(state, data) {
    state.structuresList = data;
  },
  editStructuresId(state, data) {
    state.structuresId = [data];
  },
  editArticleData(state, data) {
    state.articleData = data;
  },
  editArticleId(state, data) {
    state.articleId = [data];
  },
  editReadUsers(state, data) {
    state.readUsers = data;
  },
  editUnreadData(state, data) {
    state.unreadData = data;
  },
  editProvincesData(state, data) {
    state.provincesData = data.list;
  },
  editGetForms(state, params) {
    Object.assign(state.getForms, params)
  },
  editDocumentNews(state, params) {
    if (params.userse && params.resm) {
      state.documentNews = Object.assign({}, params.userse, params.resm);
    }
  }
}
