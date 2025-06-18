const formatAuditTrail = (auditTrail, action, userId) => {
  const newEntry = {
    action,
    user_id: userId,
    timestamp: new Date().toISOString(),
  };
  return [...auditTrail, newEntry];
};

module.exports = {
  formatAuditTrail,
}; 