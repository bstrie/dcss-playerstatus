let SessionLoad = 1
if &cp | set nocp | endif
let s:cpo_save=&cpo
set cpo&vim
inoremap <Right> <Nop>
inoremap <Left> <Nop>
inoremap <Down> <Nop>
inoremap <Up> <Nop>
xmap S <Plug>VSurround
vnoremap <silent> \w :call EasyMotion#WB(1, 0)
onoremap <silent> \w :call EasyMotion#WB(0, 0)
nnoremap <silent> \w :call EasyMotion#WB(0, 0)
vnoremap <silent> \t :call EasyMotion#T(1, 0)
onoremap <silent> \t :call EasyMotion#T(0, 0)
nnoremap <silent> \t :call EasyMotion#T(0, 0)
vnoremap <silent> \n :call EasyMotion#Search(1, 0)
onoremap <silent> \n :call EasyMotion#Search(0, 0)
nnoremap <silent> \n :call EasyMotion#Search(0, 0)
vnoremap <silent> \k :call EasyMotion#JK(1, 1)
onoremap <silent> \k :call EasyMotion#JK(0, 1)
nnoremap <silent> \k :call EasyMotion#JK(0, 1)
vnoremap <silent> \j :call EasyMotion#JK(1, 0)
onoremap <silent> \j :call EasyMotion#JK(0, 0)
nnoremap <silent> \j :call EasyMotion#JK(0, 0)
vnoremap <silent> \gE :call EasyMotion#EW(1, 1)
onoremap <silent> \gE :call EasyMotion#EW(0, 1)
nnoremap <silent> \gE :call EasyMotion#EW(0, 1)
vnoremap <silent> \f :call EasyMotion#F(1, 0)
onoremap <silent> \f :call EasyMotion#F(0, 0)
nnoremap <silent> \f :call EasyMotion#F(0, 0)
vnoremap <silent> \e :call EasyMotion#E(1, 0)
onoremap <silent> \e :call EasyMotion#E(0, 0)
nnoremap <silent> \e :call EasyMotion#E(0, 0)
vnoremap <silent> \b :call EasyMotion#WB(1, 1)
onoremap <silent> \b :call EasyMotion#WB(0, 1)
nnoremap <silent> \b :call EasyMotion#WB(0, 1)
vnoremap <silent> \W :call EasyMotion#WBW(1, 0)
onoremap <silent> \W :call EasyMotion#WBW(0, 0)
nnoremap <silent> \W :call EasyMotion#WBW(0, 0)
vnoremap <silent> \T :call EasyMotion#T(1, 1)
onoremap <silent> \T :call EasyMotion#T(0, 1)
nnoremap <silent> \T :call EasyMotion#T(0, 1)
vnoremap <silent> \N :call EasyMotion#Search(1, 1)
onoremap <silent> \N :call EasyMotion#Search(0, 1)
nnoremap <silent> \N :call EasyMotion#Search(0, 1)
vnoremap <silent> \ge :call EasyMotion#E(1, 1)
onoremap <silent> \ge :call EasyMotion#E(0, 1)
nnoremap <silent> \ge :call EasyMotion#E(0, 1)
vnoremap <silent> \F :call EasyMotion#F(1, 1)
onoremap <silent> \F :call EasyMotion#F(0, 1)
nnoremap <silent> \F :call EasyMotion#F(0, 1)
vnoremap <silent> \E :call EasyMotion#EW(1, 0)
onoremap <silent> \E :call EasyMotion#EW(0, 0)
nnoremap <silent> \E :call EasyMotion#EW(0, 0)
vnoremap <silent> \B :call EasyMotion#WBW(1, 1)
onoremap <silent> \B :call EasyMotion#WBW(0, 1)
nnoremap <silent> \B :call EasyMotion#WBW(0, 1)
nmap cs <Plug>Csurround
nmap ds <Plug>Dsurround
nmap gx <Plug>NetrwBrowseX
xmap gS <Plug>VgSurround
nmap h <Nop>
nmap l <Nop>
vnoremap p "_dP
xnoremap <silent> s :echoerr 'surround.vim: Visual mode s has been removed in favor of S'
noremap x "_x
nmap ySS <Plug>YSsurround
nmap ySs <Plug>YSsurround
nmap yss <Plug>Yssurround
nmap yS <Plug>YSurround
nmap ys <Plug>Ysurround
nnoremap <silent> <Plug>NetrwBrowseX :call netrw#NetrwBrowseX(expand("<cWORD>"),0)
noremap <Right> <Nop>
noremap <Left> <Nop>
noremap <Down> <Nop>
noremap <Up> <Nop>
imap S <Plug>ISurround
imap s <Plug>Isurround
imap  <Plug>Isurround
let &cpo=s:cpo_save
unlet s:cpo_save
set background=dark
set backspace=indent,eol,start
set expandtab
set fileencodings=ucs-bom,utf-8,default,latin1
set helplang=en
set hlsearch
set ignorecase
set incsearch
set laststatus=2
set ruler
set runtimepath=~/.vim,~/.vim/bundle/vim-colors-solarized,~/.vim/bundle/vim-easymotion,~/.vim/bundle/vim-powerline,~/.vim/bundle/vim-surround,/var/lib/vim/addons,/usr/share/vim/vimfiles,/usr/share/vim/vim73,/usr/share/vim/vimfiles/after,/var/lib/vim/addons/after,~/.vim/after
set scrolljump=5
set scrolloff=3
set shiftwidth=4
set smartcase
set suffixes=.bak,~,.swp,.o,.info,.aux,.log,.dvi,.bbl,.blg,.brf,.cb,.ind,.idx,.ilg,.inx,.out,.toc
set tabstop=4
set viminfo='10,\"100,:20,%,n~/.viminfo
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd /var/www/crawl/player-status
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +0 playerstatus.js
badd +0 fetch.php
badd +0 index.html
badd +1 playerstatus.css
badd +0 style.css
args playerstatus.js
edit playerstatus.js
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal keymap=
setlocal noarabic
setlocal noautoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
set colorcolumn=80
setlocal colorcolumn=80
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*%s*/
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'javascript'
setlocal filetype=javascript
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=4
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=0
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#GetStatusline({'noncurrent':\ '%(%#Plef4e4e4eeb262626N#%(%#Pl58870000eb262626N#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Plf58a8a8aeb262626b#\ %t\ %)%(%#Pl58870000eb262626N#%M\ %)%(%#Plef4e4e4eeb262626N#%H%W\ %)%#Pleb262626e9121212N#%)%=%(%#Plea1c1c1ce9121212N#%#Plf1626262ea1c1c1cN#\ %3p%%\ %)%(%#Pleb262626ea1c1c1cN#%#Plf1626262eb262626N#%(%#Plf58a8a8aeb262626N#\ LN\ %3l%)%(%#Plf1626262eb262626N#:%-2c\ %)%)',\ 'current':\ '%(%#Pl16005f0094afd700b#\ \ %-2{Stl_GetMode()}\ %#Pl94afd700f0585858N#%)%(%#Plfabcbcbcf0585858N#%(%#Plc4ff0000f0585858N#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Ple7fffffff0585858b#\ %t\ %)%(%#Plc4ff0000f0585858b#%M\ %)%(%#Plfabcbcbcf0585858N#%H%W\ %)%#Plf0585858ec303030N#%)%=%(%#Plec303030ec303030N#%#Plf6949494ec303030N#%{&fileformat}\ %{(&fenc\ ==\ ''''\ ?\ &enc\ :\ &fenc)}\ %)%(%#Plf6949494ec303030N#│%#Plf6949494ec303030N#\ FT\ %{strlen(&ft)\ ?\ &ft\ :\ ''n/a''}\ %)%(%#Plf0585858ec303030N#%#Plfabcbcbcf0585858N#\ %3p%%\ %)%(%#Plfcd0d0d0f0585858N#%#Plfabcbcbcfcd0d0d0N#%(%#Plec303030fcd0d0d0b#\ LN\ %3l%)%(%#Plf4808080fcd0d0d0N#:%-2c\ %)%)',\ 'insert':\ '%(%#Pl17005f5fe7ffffffb#\ \ %-2{Stl_GetMode()}\ %#Ple7ffffff1f0087afN#%)%(%#Pl7587d7ff1f0087afN#%(%#Plc4ff00001f0087afN#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Ple7ffffff1f0087afb#\ %t\ %)%(%#Plc4ff00001f0087afb#%M\ %)%(%#Pl7587d7ff1f0087afN#%H%W\ %)%#Pl1f0087af18005f87N#%)%=%(%#Pl18005f8718005f87N#%#Pl4b5fafff18005f87N#%{&fileformat}\ %{(&fenc\ ==\ ''''\ ?\ &enc\ :\ &fenc)}\ %)%(%#Pl4b5fafff18005f87N#│%#Pl4b5fafff18005f87N#\ FT\ %{strlen(&ft)\ ?\ &ft\ :\ ''n/a''}\ %)%(%#Pl1f0087af18005f87N#%#Pl7587d7ff1f0087afN#\ %3p%%\ %)%(%#Pl7587d7ff1f0087afN#%#Pl7587d7ff7587d7ffN#%(%#Pl17005f5f7587d7ffb#\ LN\ %3l%)%(%#Pl17005f5f7587d7ffN#:%-2c\ %)%)'},1)
setlocal suffixesadd=
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'javascript'
setlocal syntax=javascript
endif
setlocal tabstop=4
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 78 - ((8 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
78
normal! 062l
tabedit playerstatus.css
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal keymap=
setlocal noarabic
setlocal noautoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
set colorcolumn=80
setlocal colorcolumn=80
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*%s*/
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'css'
setlocal filetype=css
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=4
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=0
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#GetStatusline({'noncurrent':\ '%(%#Plef4e4e4eeb262626N#%(%#Pl58870000eb262626N#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Plf58a8a8aeb262626b#\ %t\ %)%(%#Pl58870000eb262626N#%M\ %)%(%#Plef4e4e4eeb262626N#%H%W\ %)%#Pleb262626e9121212N#%)%=%(%#Plea1c1c1ce9121212N#%#Plf1626262ea1c1c1cN#\ %3p%%\ %)%(%#Pleb262626ea1c1c1cN#%#Plf1626262eb262626N#%(%#Plf58a8a8aeb262626N#\ LN\ %3l%)%(%#Plf1626262eb262626N#:%-2c\ %)%)',\ 'current':\ '%(%#Pl16005f0094afd700b#\ \ %-2{Stl_GetMode()}\ %#Pl94afd700f0585858N#%)%(%#Plfabcbcbcf0585858N#%(%#Plc4ff0000f0585858N#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Ple7fffffff0585858b#\ %t\ %)%(%#Plc4ff0000f0585858b#%M\ %)%(%#Plfabcbcbcf0585858N#%H%W\ %)%#Plf0585858ec303030N#%)%=%(%#Plec303030ec303030N#%#Plf6949494ec303030N#%{&fileformat}\ %{(&fenc\ ==\ ''''\ ?\ &enc\ :\ &fenc)}\ %)%(%#Plf6949494ec303030N#│%#Plf6949494ec303030N#\ FT\ %{strlen(&ft)\ ?\ &ft\ :\ ''n/a''}\ %)%(%#Plf0585858ec303030N#%#Plfabcbcbcf0585858N#\ %3p%%\ %)%(%#Plfcd0d0d0f0585858N#%#Plfabcbcbcfcd0d0d0N#%(%#Plec303030fcd0d0d0b#\ LN\ %3l%)%(%#Plf4808080fcd0d0d0N#:%-2c\ %)%)',\ 'insert':\ '%(%#Pl17005f5fe7ffffffb#\ \ %-2{Stl_GetMode()}\ %#Ple7ffffff1f0087afN#%)%(%#Pl7587d7ff1f0087afN#%(%#Plc4ff00001f0087afN#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Ple7ffffff1f0087afb#\ %t\ %)%(%#Plc4ff00001f0087afb#%M\ %)%(%#Pl7587d7ff1f0087afN#%H%W\ %)%#Pl1f0087af18005f87N#%)%=%(%#Pl18005f8718005f87N#%#Pl4b5fafff18005f87N#%{&fileformat}\ %{(&fenc\ ==\ ''''\ ?\ &enc\ :\ &fenc)}\ %)%(%#Pl4b5fafff18005f87N#│%#Pl4b5fafff18005f87N#\ FT\ %{strlen(&ft)\ ?\ &ft\ :\ ''n/a''}\ %)%(%#Pl1f0087af18005f87N#%#Pl7587d7ff1f0087afN#\ %3p%%\ %)%(%#Pl7587d7ff1f0087afN#%#Pl7587d7ff7587d7ffN#%(%#Pl17005f5f7587d7ffb#\ LN\ %3l%)%(%#Pl17005f5f7587d7ffN#:%-2c\ %)%)'},0)
setlocal suffixesadd=
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'css'
setlocal syntax=css
endif
setlocal tabstop=4
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 8 - ((7 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
8
normal! 02l
tabedit index.html
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal keymap=
setlocal noarabic
setlocal noautoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
set colorcolumn=80
setlocal colorcolumn=80
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*%s*/
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'html'
setlocal filetype=html
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=4
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=0
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#GetStatusline({'noncurrent':\ '%(%#Plef4e4e4eeb262626N#%(%#Pl58870000eb262626N#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Plf58a8a8aeb262626b#\ %t\ %)%(%#Pl58870000eb262626N#%M\ %)%(%#Plef4e4e4eeb262626N#%H%W\ %)%#Pleb262626e9121212N#%)%=%(%#Plea1c1c1ce9121212N#%#Plf1626262ea1c1c1cN#\ %3p%%\ %)%(%#Pleb262626ea1c1c1cN#%#Plf1626262eb262626N#%(%#Plf58a8a8aeb262626N#\ LN\ %3l%)%(%#Plf1626262eb262626N#:%-2c\ %)%)',\ 'current':\ '%(%#Pl16005f0094afd700b#\ \ %-2{Stl_GetMode()}\ %#Pl94afd700f0585858N#%)%(%#Plfabcbcbcf0585858N#%(%#Plc4ff0000f0585858N#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Ple7fffffff0585858b#\ %t\ %)%(%#Plc4ff0000f0585858b#%M\ %)%(%#Plfabcbcbcf0585858N#%H%W\ %)%#Plf0585858ec303030N#%)%=%(%#Plec303030ec303030N#%#Plf6949494ec303030N#%{&fileformat}\ %{(&fenc\ ==\ ''''\ ?\ &enc\ :\ &fenc)}\ %)%(%#Plf6949494ec303030N#│%#Plf6949494ec303030N#\ FT\ %{strlen(&ft)\ ?\ &ft\ :\ ''n/a''}\ %)%(%#Plf0585858ec303030N#%#Plfabcbcbcf0585858N#\ %3p%%\ %)%(%#Plfcd0d0d0f0585858N#%#Plfabcbcbcfcd0d0d0N#%(%#Plec303030fcd0d0d0b#\ LN\ %3l%)%(%#Plf4808080fcd0d0d0N#:%-2c\ %)%)',\ 'insert':\ '%(%#Pl17005f5fe7ffffffb#\ \ %-2{Stl_GetMode()}\ %#Ple7ffffff1f0087afN#%)%(%#Pl7587d7ff1f0087afN#%(%#Plc4ff00001f0087afN#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Ple7ffffff1f0087afb#\ %t\ %)%(%#Plc4ff00001f0087afb#%M\ %)%(%#Pl7587d7ff1f0087afN#%H%W\ %)%#Pl1f0087af18005f87N#%)%=%(%#Pl18005f8718005f87N#%#Pl4b5fafff18005f87N#%{&fileformat}\ %{(&fenc\ ==\ ''''\ ?\ &enc\ :\ &fenc)}\ %)%(%#Pl4b5fafff18005f87N#│%#Pl4b5fafff18005f87N#\ FT\ %{strlen(&ft)\ ?\ &ft\ :\ ''n/a''}\ %)%(%#Pl1f0087af18005f87N#%#Pl7587d7ff1f0087afN#\ %3p%%\ %)%(%#Pl7587d7ff1f0087afN#%#Pl7587d7ff7587d7ffN#%(%#Pl17005f5f7587d7ffb#\ LN\ %3l%)%(%#Pl17005f5f7587d7ffN#:%-2c\ %)%)'},0)
setlocal suffixesadd=
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'html'
setlocal syntax=html
endif
setlocal tabstop=4
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 6 - ((5 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
6
normal! 0
tabedit fetch.php
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
argglobal
setlocal keymap=
setlocal noarabic
setlocal noautoindent
setlocal nobinary
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
set colorcolumn=80
setlocal colorcolumn=80
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=/*%s*/
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
setlocal nocursorline
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'php'
setlocal filetype=php
endif
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=0
setlocal foldmarker={{{,}}}
setlocal foldmethod=manual
setlocal foldminlines=1
setlocal foldnestmax=20
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=0
setlocal include=
setlocal includeexpr=
setlocal indentexpr=
setlocal indentkeys=0{,0},:,0#,!^F,o,O,e
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal nolist
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=octal,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal shiftwidth=4
setlocal noshortname
setlocal nosmartindent
setlocal softtabstop=0
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!Pl#GetStatusline({'noncurrent':\ '%(%#Plef4e4e4eeb262626N#%(%#Pl58870000eb262626N#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Plf58a8a8aeb262626b#\ %t\ %)%(%#Pl58870000eb262626N#%M\ %)%(%#Plef4e4e4eeb262626N#%H%W\ %)%#Pleb262626e9121212N#%)%=%(%#Plea1c1c1ce9121212N#%#Plf1626262ea1c1c1cN#\ %3p%%\ %)%(%#Pleb262626ea1c1c1cN#%#Plf1626262eb262626N#%(%#Plf58a8a8aeb262626N#\ LN\ %3l%)%(%#Plf1626262eb262626N#:%-2c\ %)%)',\ 'current':\ '%(%#Pl16005f0094afd700b#\ \ %-2{Stl_GetMode()}\ %#Pl94afd700f0585858N#%)%(%#Plfabcbcbcf0585858N#%(%#Plc4ff0000f0585858N#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Ple7fffffff0585858b#\ %t\ %)%(%#Plc4ff0000f0585858b#%M\ %)%(%#Plfabcbcbcf0585858N#%H%W\ %)%#Plf0585858ec303030N#%)%=%(%#Plec303030ec303030N#%#Plf6949494ec303030N#%{&fileformat}\ %{(&fenc\ ==\ ''''\ ?\ &enc\ :\ &fenc)}\ %)%(%#Plf6949494ec303030N#│%#Plf6949494ec303030N#\ FT\ %{strlen(&ft)\ ?\ &ft\ :\ ''n/a''}\ %)%(%#Plf0585858ec303030N#%#Plfabcbcbcf0585858N#\ %3p%%\ %)%(%#Plfcd0d0d0f0585858N#%#Plfabcbcbcfcd0d0d0N#%(%#Plec303030fcd0d0d0b#\ LN\ %3l%)%(%#Plf4808080fcd0d0d0N#:%-2c\ %)%)',\ 'insert':\ '%(%#Pl17005f5fe7ffffffb#\ \ %-2{Stl_GetMode()}\ %#Ple7ffffff1f0087afN#%)%(%#Pl7587d7ff1f0087afN#%(%#Plc4ff00001f0087afN#%{&readonly\ ?\ ''\ RO''\ :\ ''''}%)%(%#Ple7ffffff1f0087afb#\ %t\ %)%(%#Plc4ff00001f0087afb#%M\ %)%(%#Pl7587d7ff1f0087afN#%H%W\ %)%#Pl1f0087af18005f87N#%)%=%(%#Pl18005f8718005f87N#%#Pl4b5fafff18005f87N#%{&fileformat}\ %{(&fenc\ ==\ ''''\ ?\ &enc\ :\ &fenc)}\ %)%(%#Pl4b5fafff18005f87N#│%#Pl4b5fafff18005f87N#\ FT\ %{strlen(&ft)\ ?\ &ft\ :\ ''n/a''}\ %)%(%#Pl1f0087af18005f87N#%#Pl7587d7ff1f0087afN#\ %3p%%\ %)%(%#Pl7587d7ff1f0087afN#%#Pl7587d7ff7587d7ffN#%(%#Pl17005f5f7587d7ffb#\ LN\ %3l%)%(%#Pl17005f5f7587d7ffN#:%-2c\ %)%)'},0)
setlocal suffixesadd=
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'php'
setlocal syntax=php
endif
setlocal tabstop=4
setlocal tags=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
silent! normal! zE
let s:l = 65 - ((31 * winheight(0) + 19) / 39)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
65
normal! 0
tabnext 1
if exists('s:wipebuf')
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToO
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
