import { QueryInterface, DataTypes } from 'sequelize';

async function columnExists(queryInterface: QueryInterface, tableName: string, columnName: string): Promise<boolean> {
  const tableDescription = await queryInterface.describeTable(tableName);
  return columnName in tableDescription;
}

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Check and add phone column
  const hasPhoneColumn = await columnExists(queryInterface, 'orders', 'phone');
  if (!hasPhoneColumn) {
    await queryInterface.addColumn('orders', 'phone', {
      type: DataTypes.STRING,
      allowNull: true
    });
  }

  // Check and add notes column
  const hasNotesColumn = await columnExists(queryInterface, 'orders', 'notes');
  if (!hasNotesColumn) {
    await queryInterface.addColumn('orders', 'notes', {
      type: DataTypes.TEXT,
      allowNull: true
    });
  }
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Check and remove phone column
  const hasPhoneColumn = await columnExists(queryInterface, 'orders', 'phone');
  if (hasPhoneColumn) {
    await queryInterface.removeColumn('orders', 'phone');
  }

  // Check and remove notes column
  const hasNotesColumn = await columnExists(queryInterface, 'orders', 'notes');
  if (hasNotesColumn) {
    await queryInterface.removeColumn('orders', 'notes');
  }
}
