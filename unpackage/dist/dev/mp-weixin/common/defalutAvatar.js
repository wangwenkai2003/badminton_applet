"use strict";
let defalutAvatar = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjk3MTgxOTQ5MDYwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyNDIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUwNC4yIDQ3LjFjMjU3LjEgMC4yIDQ2NC4zIDIwOC41IDQ2My44IDQ2Ni42LTAuNCAyNTQuNi0yMDkuNCA0NjEuOS00NjUuMiA0NjEuNUMyNDcuOSA5NzQuOSAzOS43IDc2Ni42IDQwIDUxMi4zIDQwLjMgMjU0LjYgMjQ3LjUgNDcgNTA0LjIgNDcuMXoiIGZpbGw9IiM1NkFCQzUiIHAtaWQ9IjQyNDMiPjwvcGF0aD48cGF0aCBkPSJNNDQyLjMgNzAwLjhjMjkuOS0xMi45IDU5LjgtMjUuNyA4OS43LTM4LjggMjQuMy0xMC42IDQ4LjQtMjEuNiA3Mi42LTMyLjQgMi45LTAuNiA1LjktMS4yIDguOC0xLjcgNjEuMi05LjcgMTIyLjMtMTkuNSAxODMuNS0yOSA2LjMtMSA2LjktNC4xIDYuOS05LjItMC4xLTMxLjcgMC4xLTYzLjQtMC4yLTk1LjEgMC0yLjgtMi4zLTUuNS0zLjUtOC4zbC03OS4yLTQ5LjVjLTAuMy0zLjMtMC45LTYuNS0wLjktOS44LTAuNC0yNy45LTAuNy01NS43LTEuMy04My42IDAtMi4zLTEuNS00LjYtMi4yLTYuOS0zMi42LTAuMi02NS4yLTAuNC05Ny43LTAuNS0wLjUtMS43LTEuMy0zLjQtMS41LTUuMi01LTM1LjQtOS45LTcwLjgtMTQuNy0xMDYuMi0wLjYtNC43LTItNy41LTcuMy02LjQtMzcuMS0wLjEtNzQuMiAwLjEtMTExLjMtMC40LTcuNS0wLjEtMTAuMyAyLjMtMTIuMyA5LjItMTUgNTAuNS0zMC4zIDEwMC45LTQ1LjcgMTUxLjMtNC41IDE0LjctNy4zIDMwLjMtMTQuMyA0My43LTI3IDUyLjItNTUuNCAxMDMuNi04My4zIDE1NS4zLTguMiA3LjYtMTYuNSAxNS4zLTI0LjcgMjIuOS01LjcgNS4zLTExLjkgMTAuMy0xNy4xIDE2LjEtMjMuNiAyNi4yLTI5LjIgNTYuMi0xNi41IDg4LjkgMTIgMzAuOCA0My43IDUyLjMgNzUuOCA1MyAyOS44IDAuNiA1Mi40LTEzLjMgNzEuNy0zNC40IDguMi03LjcgMTYuNC0xNS40IDI0LjctMjN6IiBmaWxsPSIjRkZGRkZGIiBwLWlkPSI0MjQ0Ij48L3BhdGg+PHBhdGggZD0iTTgwMC4xIDQ4Ni4yYzEuMiAyLjggMy40IDUuNSAzLjUgOC4zIDAuMiAzMS43IDAuMSA2My40IDAuMiA5NS4xIDAgNS0wLjYgOC4yLTYuOSA5LjItNjEuMiA5LjQtMTIyLjQgMTkuMi0xODMuNSAyOS0zIDAuNS01LjkgMS4xLTguOCAxLjctOC4zLTIuNC0xNi43LTQuOC0yNS03LjItMTQuNy00LjItMjkuMy04LjQtNDQtMTIuNy0yLjUtMS40LTUuMS0yLjktNy45LTQuNSA3LjYtMy41IDE0LjctNy4xIDIyLTEwLjIgMjQuOS0xMC40IDUwLTIwLjQgNzQuOS0zMC45IDUwLjQtMjEuMiAxMDAuOC00Mi40IDE1MS4xLTY0IDguNS0zLjggMTYuMy05LjIgMjQuNC0xMy44ek03MjEgNDM2LjdjLTkuMyA2LTE4LjggMTEuNy0yNy44IDE4LTM1LjYgMjUuMS03MS4xIDUwLjQtMTA2LjUgNzUuNy0xMi4yIDguNy0yNC40IDE3LjYtMzYuNSAyNi40LTE5LjctMS0zOS41LTItNTkuMi0yLjktMC44IDAtMS42IDAuOC0yLjQgMS4yLTIuNi0xLTUuMi0yLTguNi0zLjMgMTAuOC0xMC4xIDIxLjEtMjAuMSAzMS44LTI5LjcgMTQuNS0xMy4xIDI5LjMtMjUuOCA0My45LTM4LjggMjcuNC0yNC40IDU0LjktNDguNyA4Mi4yLTczLjIgMjEuMy0xOS4xIDQyLjMtMzguNCA2My4zLTU3LjggNS40LTUgMTAuMy0xMC41IDE1LjUtMTUuOCAwLjggMi4zIDIuMiA0LjYgMi4yIDYuOSAwLjUgMjcuOSAwLjggNTUuNyAxLjMgODMuNi0wLjEgMy4yIDAuNCA2LjUgMC44IDkuN3pNNjE4LjggMzM1LjljLTkuMyAxMC4yLTE4LjYgMjAuMy0yOCAzMC41LTMzIDM2LTY2IDcyLjEtOTkuMiAxMDguMS0yLjggMy4xLTYuMyA1LjUtOS40IDguMi03IDIuMy0xNC4yIDQuMy0yMSA3LTYuOCAyLjctMTMuMyA2LjEtMTkuOSA5LjItMC42IDAtMS4zIDAuMS0xLjkgMC4xbDAuNCAwLjFjLTIuNiAwLjItNS4yIDAuNC05LjIgMC43IDcuMS0xMS41IDEzLjgtMjIuMiAyMC40LTMzLjEgMjguNC00Ny4xIDU2LjgtOTQuMyA4NS4yLTE0MS40IDE4LjItMzAuMSAzNi44LTU5LjkgNTQuNS05MC4yIDIuOC00LjggMTAuMi05LjYgNC42LTE3LjEgNS4zLTEuMiA2LjcgMS42IDcuMyA2LjQgNC44IDM1LjQgOS43IDcwLjggMTQuNyAxMDYuMiAwLjIgMS45IDEgMy42IDEuNSA1LjN6IiBmaWxsPSIjRTFFM0U0IiBwLWlkPSI0MjQ1Ij48L3BhdGg+PHBhdGggZD0iTTQxNy42IDcyMy41Yy0zOC00MS4yLTc1LjktODIuNC0xMTMuOS0xMjMuNSA4LjItNy42IDE2LjUtMTUuMyAyNC43LTIyLjkgNC4yIDQuMiA4LjMgOC40IDEyLjUgMTIuNmwxNi41IDE4YzMuOCA0LjIgNy43IDguNSAxMS41IDEyLjcgMy45IDQuMSA3LjggOC4zIDExLjYgMTIuNCAzLjYgMy45IDcuMyA3LjggMTAuOSAxMS43bDExLjEgMTIuMyAxMi4zIDEyLjljNS4zIDYgMTAuNiAxMiAxNS45IDE3LjkgMy45IDQuMyA3LjcgOC42IDExLjUgMTIuOS04LjIgNy44LTE2LjQgMTUuNC0yNC42IDIzeiIgZmlsbD0iI0Q4NjE1QSIgcC1pZD0iNDI0NiI+PC9wYXRoPjxwYXRoIGQ9Ik0zODAuNiA2MzIuOGMtMy45LTQuMS03LjgtOC4zLTExLjYtMTIuNCAyMi44LTM4IDQ1LjUtNzUuOSA2OC4yLTExMy45IDEuMy0yLjIgMS44LTQuOSAyLjctNy40bC0wLjQtMC4xYzAuNiAwIDEuMy0wLjEgMS45LTAuMSA2LjYtMy4xIDEzLjEtNi41IDE5LjktOS4yIDYuOS0yLjcgMTQtNC43IDIxLTctMC45IDE2LjUtMi40IDMzLTIuNCA0OS41IDAgOC4xLTQgMTIuNS05LjMgMTcuMy0yOC43IDI2LjItNTcuMiA1Mi41LTg1LjcgNzguOC0xLjUgMS40LTIuOSAzLTQuMyA0LjV6IiBmaWxsPSIjNTlBQ0M1IiBwLWlkPSI0MjQ3Ij48L3BhdGg+PHBhdGggZD0iTTM1Ny41IDYwNy43bC0xNi41LTE4YzIyLjUtNDEuOSA0NS04My45IDY3LjUtMTI1LjggMy01LjUgNi0xMSAxMC4yLTE4LjUgMy40IDE1LjIgNi43IDI4LjMgOS4xIDQxLjYgMC41IDIuNy0yIDYuMS0zLjcgOC45LTIyLjEgMzcuMy00NC40IDc0LjUtNjYuNiAxMTEuOHoiIGZpbGw9IiM1QUFFQzYiIHAtaWQ9IjQyNDgiPjwvcGF0aD48cGF0aCBkPSJNNTc5LjUgNjIyLjFjLTMxLjEgMTMuOC02Mi4yIDI3LjctOTMuMyA0MS40LTE4LjUgOC4xLTM3IDE2LjEtNTUuNSAyNC4yLTUuMy02LTEwLjYtMTItMTUuOS0xNy45IDMzLjMtMTYuNSA2Ni43LTMzIDEwMC00OS41IDctMy41IDEzLjgtNy4yIDIwLjctMTAuOCAxNC43IDQuMiAyOS4zIDguNCA0NCAxMi42eiIgZmlsbD0iIzU5QUNDNSIgcC1pZD0iNDI0OSI+PC9wYXRoPjxwYXRoIGQ9Ik00MDIuNSA2NTYuOGwtMTEuMS0xMi4zYzMyLjMtMjkuOCA2NC42LTU5LjYgOTYuOS04OS41IDAuOC0wLjQgMS42LTEuMiAyLjQtMS4yIDE5LjcgMC45IDM5LjUgMS45IDU5LjIgMi45LTcuOCAyNy0yNS44IDQyLjgtNTEuNyA1My42LTMyLjYgMTMuNy02My44IDMwLjktOTUuNyA0Ni41eiIgZmlsbD0iIzU5QURDNSIgcC1pZD0iNDI1MCI+PC9wYXRoPjwvc3ZnPg==";
exports.defalutAvatar = defalutAvatar;
