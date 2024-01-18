export const error = (_req: any, res: any) => {
  res.render('error/404', { title: '404 | страница не найдена' })
}
// export const error = multer({ storage, fileFilter })